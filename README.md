# Trithemius

An alternative for Google Translator Toolkit orphans.

Supported translation APIs:

* Google Translate

Supported storage drivers:

* Google Firebase Cloudstore (with Authentication)
* Browser localstorage (for testing purposes)

## Project setup

```bash
yarn
cp .env.example .env
```

Edit the `.env` file to set your storage and translation drivers.

If you are using the Google Firebase storage driver, please run:

```bash
firebase init firestore
firebase deploy --only firestore:rules
```

### Compiles and hot-reloads for development

```bash
yarn serve
```

### Compiles and minifies for production

```bash
yarn build
firebase deploy --only firestore:rules
firebase deploy --only hosting
```

### Lints and fixes files

```bash
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
