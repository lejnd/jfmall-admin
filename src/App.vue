<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="less">
html, body {
     height: 100%;
     font-family: "Helvetica Neue","Luxi Sans","DejaVu Sans",Tahoma,"Hiragino Sans GB","Microsoft Yahei",sans-serif;
     min-width: 1200px;
     overflow-x: hidden;
}
#app {
    // padding: 30px 20px;
    height: 100%;
    background-color: #fff;
}
a {
    text-decoration: none;
    color: inherit
}
</style>