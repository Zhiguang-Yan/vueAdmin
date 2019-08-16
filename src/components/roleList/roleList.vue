<template>
  <el-card
    class="roleList"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="正在加载中"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <breadcrumb :level1="level1" :level2="level2"></breadcrumb>
    <el-row>
      <el-col class="breadcrumb">
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="400px" :data="roleList" style="width: 100%" :border="true">
      <el-table-column width="40" type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item, index) in scope.row.children" :key="index">
            <el-col :span="4">
              <el-tag @close="deletePermission(scope.row,item.id)" closable>{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item1, index) in item.children" :key="index">
                <el-col :span="4">
                  <el-tag
                    @close="deletePermission(scope.row,item1.id)"
                    closable
                    type="info"
                  >{{item1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deletePermission(scope.row,item2.id)"
                    closable
                    type="success"
                    v-for="(item2, index) in item1.children"
                    :key="index"
                    style="margin:0 10px 10px 0;"
                  >{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限是提示 -->
          <h3 v-if="scope.row.children.length===0">未分配权限</h3>
        </template>
      </el-table-column>

      <el-table-column label="#" width="40" type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="120"></el-table-column>
      <el-table-column label="角色描述" width="120" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            @click="showEditUserDia(scope.row)"
            size="medium"
            circle
          ></el-button>
          <el-button
            @click="showDeleUserMsgBox(scope.row.id)"
            type="danger"
            plain
            icon="el-icon-delete"
            size="medium"
            circle
          ></el-button>-->
          <el-button
            @click="showSettingsRoleDia(scope.row)"
            type="primary"
            plain
            icon="el-icon-plus"
            size="medium"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加权限对话框 -->
    <el-dialog title="添加权限" :visible.sync="dialogVisible">
      <el-input placeholder="请输入您要添加或删除的权限" v-model="keyword" clearable></el-input>
      <!-- 树形 -->
      <el-tree
        class="tree"
        :data="treeData"
        ref="tree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkList"
        :props="defaultProps"
        :filter-node-method="filterNode"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermission">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  name: 'roleList',
  data () {
    return {
      level1: '权限管理',
      level2: '角色列表',
      // 权限列表
      roleList: [],
      roleId: -1,
      // 全屏加载
      fullscreenLoading: false,
      dialogVisible: false,
      // 搜素关键字
      keyword: '',
      // 树形数据
      treeData: [],
      // 默认被选的数据
      checkList: [],
      // 默认传输的数据
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 过滤节点
    filterNode (value, data) {
      if (!value) return true
      return data.authName.indexOf(value.replace(/\s/g, '')) !== -1
    },
    // 获取权限列表
    async getRoleList () {
      this.fullscreenLoading = true
      const res = await this.$axios
        .get('/roles')
        .then(res => {
          const {
            data,
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.roleList = data
            setTimeout(() => {
              this.fullscreenLoading = false
            }, 700)
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(err => {})
    },
    // 删除权限
    async deletePermission (role, rightId) {
      // roles/:roleId/rights/:roleId
      // delete
      // 参数:roleId :rightId

      const res = await this.$axios
        .delete(`/roles/${role.id}/rights/${rightId}`)
        .then(res => {
          const {
            data,
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            // 更新当前的权限
            // debugger
            role.children = data

            console.log(data)

            this.$message({
              message: msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            message: '网络炸了',
            type: 'error'
          })
        })
    },

    // 获得tree形结构数据
    async getTreeRole () {
      const res = await this.$axios
        .get(`rights/tree`)
        .then(res => {
          const {
            data,
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.treeData = data
            // 展开所有菜单
            // const arrlist = [];
            // this.treeData.forEach(element => {
            //   arrlist.push(element.id);
            //   element.children.forEach(element1 => {
            //     arrlist.push(element1.id);
            //     element1.children.forEach(element2 => {
            //       arrlist.push(element2.id);
            //     });
            //   });
            // });
          } else {
            this.$message.error(msg)
          }
        })
        .catch(() => {
          this.$message({
            message: '服务器炸了',
            type: 'errpr'
          })
        })
    },
    // 提交修改后的权限
    async submitPermission () {
      this.dialogVisible = false
      // getCheckedKeys//权限
      // getHalfCheckedKeys//半选
      let arr1 = this.$refs.tree.getCheckedKeys()
      let arr2 = this.$refs.tree.getHalfCheckedKeys()
      // let arr=arr1.concat(arr2)
      // 合并数组并且让数组成为以,隔开的字符串列表
      let arr = [...arr1, ...arr2].join(',')
      let _this = this
      const res = await this.$axios
        .post(`/roles/${_this.roleId}/rights`, {
          rids: arr
        })
        .then(res => {
          const {
            meta: { msg, status }
          } = res.data

          if (status === 200) {
            this.$message({
              message: msg,
              type: 'success'
            })

            this.getRoleList()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error('请求失败')
        })
    },
    // 打开权限
    showSettingsRoleDia (roleList) {
      this.getTreeRole()
      this.roleId = roleList.id
      // 得到删除后的数据
      const arr = []
      roleList.children.forEach(element => {
        element.children.forEach(element1 => {
          element1.children.forEach(element2 => {
            // 只要最后的id防止上级id全选
            arr.push(element2.id)
          })
        })
        return arr
      })
      this.checkList = arr
      this.dialogVisible = true
    }
  },

  watch: {
    keyword (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>
<style lang="scss" scoped>
/deep/.roleList {
  height: 100%;
  .breadcrumb {
    margin: 30px 0;
  }
  & .tree {
    margin: 30px 0;
  }
}
</style>
