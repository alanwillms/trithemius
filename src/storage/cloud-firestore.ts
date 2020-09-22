import firebase from "../firebase";

const db = firebase.firestore();

enum LanguageCode {}

interface TranslationProject {
  owner: string;
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  completeness: number;
  paragraphs?: TranslationProjectParagraph[];
}

interface TranslationProjectParagraph {
  key: number;
  source: string;
  automaticTranslation?: string;
  translation: string;
  touched: boolean;
}

const getDocumentReference = (id: string) => {
  return db.collection("projects").doc(id);
};

const findTranslation = async (id: string) => {
  const docRef = getDocumentReference(id);
  const record = await docRef.get();
  const translationProject = record.data() as TranslationProject | undefined;

  if (translationProject) {
    const humanTranslation = await docRef
      .collection("translation")
      .doc("human")
      .get();

    if (humanTranslation.exists) {
      translationProject.paragraphs = humanTranslation.data().paragraphs || [];
    }
  }

  return translationProject;
};

const listTranslations = async (id: string) => {
  const records = await db.collection("projects").get();
  return records.docs.map(doc => doc.data() as TranslationProject);
};

const storeTranslation = async (project: TranslationProject) => {
  const docRef = getDocumentReference(project.id);
  const record = await docRef.get();
  if (record.exists) {
    await docRef.update(project);
    if (project.paragraphs && project.paragraphs.length > 0) {
      await docRef
        .collection("translation")
        .doc("human")
        .set({ paragraphs: project.paragraphs });
    }
    return project;
  }

  await docRef.set(project);
  await docRef
    .collection("translation")
    .doc("machine")
    .set({ paragraphs: project.paragraphs });
  await docRef
    .collection("translation")
    .doc("human")
    .set({ paragraphs: project.paragraphs });
  return project;
};

export { storeTranslation, findTranslation, listTranslations };
