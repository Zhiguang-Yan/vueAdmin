<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  name: 'breadcrumb',
  props: {
    level1: {
      type: String
    },
    level2: {
      type: String
    }
  }
}
</script>
<style>
</style>
