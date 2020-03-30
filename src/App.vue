<template>
  <Suspense>
    <template #default>
      <router-view></router-view>
    </template>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<style lang="sass">
html,
body
  background: #151d38
  color: #fff
</style>
