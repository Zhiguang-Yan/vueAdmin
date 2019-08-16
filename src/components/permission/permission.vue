<template>
  <el-card
    class="permission"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="正在加载中"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!-- 面包屑 -->
    <breadcrumb :level1="level1" :level2="level2"></breadcrumb>

    <!-- 权限列表表格 -->
    <el-table style="width: 100%" height="450px" id="table" :data="permissionList" border>
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">{{classMap[scope.row.level]}}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  name: 'permission',
  data () {
    return {
      level1: '权限管理',
      level2: '权限列表',
      permissionList: [],
      fullscreenLoading: false
    }
  },
  created () {
    this.getPermissionList()
    this.classMap = ['一级', '二级', '三级']
  },
  methods: {
    // 获取权限列表
    async getPermissionList () {
      this.fullscreenLoading = true
      const _this = this
      const res = await this.$axios.get('/rights/list').then(res => {
        const {
          data,
          meta: { msg, status }
        } = res.data
        if (status === 200) {
          this.permissionList = data
          setTimeout(() => {
            _this.fullscreenLoading = false
          }, 700)
          setTimeout(() => {
            this.$message({
              message: msg,
              type: 'success'
            })
          }, 700)
        } else {
          this.$message({
            message: msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.permission {
  height: 100%;
  #table {
    text-align: center !important;
    margin-top: 30px;
  }
}
</style>
