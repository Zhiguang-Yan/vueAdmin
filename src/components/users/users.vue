<template>
  <el-card
    class="box-card"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="正在加载中"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <breadcrumb :level1="level1" :level2="level2"></breadcrumb>
    <el-row :gutter="10" class="select">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="query" :clearable="true">
          <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="success" @click="dialogFormVisibleAdd = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="350px" :data="userList" style="width: 100%" :border="true">
      <el-table-column label="#" width="40" type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="创建时间" width="120">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="120">
        <template slot-scope="scope">
          <el-tooltip content="您确定要改变状态(。・∀・)ノ" placement="top" effect="light">
            <el-switch
              @change="changMsgState(scope.row)"
              inactive-text="😡"
              active-text="😊"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button
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
          ></el-button>
          <el-button
            @click="showSetUserRoleDrawer(scope.row)"
            type="success"
            plain
            icon="el-icon-check"
            size="medium"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 删除 -->

    <!-- 分页 -->
    <!-- 一共有32条数据
       pageNum=3,
       pageSize:2
    -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input
            :disabled="true"
            prefix-icon="el-icon-user-solid"
            v-model="form.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input clearable prefix-icon="el-icon-message" v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input clearable prefix-icon="el-icon-phone" v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false" type="warning">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户的对话框 -->

    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input prefix-icon="el-icon-user-solid" v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input prefix-icon="el-icon-lock" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input prefix-icon="el-icon-message" v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input prefix-icon="el-icon-phone" v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false" type="warning">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 权限分配 -->
    <el-drawer
      title="分配用户角色"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      ref="drawer"
      :wrapperClosable="true"
    >
      <div style="padding:5%;height:auto">
        <el-form v-model="curr" :inline="true" label-position="left">
          <el-form-item label="用户名">{{curr.username}}</el-form-item>
          <el-form-item label="角色">
            <el-select v-model="curr.rid" placeholder="请选择用户角色" clearable>
              <el-option label="请选择" :value="-1" :disabled="true"></el-option>
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="cancel">取 消</el-button>
          <el-button
            type="primary"
            @click="$refs.drawer.closeDrawer()"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </el-card>
</template>
<script>
export default {
  name: 'users',
  data () {
    return {
      level1: '用户管理',
      level2: '用户列表',
      query: '',
      pageNum: 1,
      pageSize: 6,
      total: -1,
      userList: [],
      fullscreenLoading: false,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 保存有用户角色数据
      roleList: [],

      // 当前用户的id和rid
      curr: {
        id: '',
        rid: ''
      },
      dialog: false,
      loading: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    // 确认角色分配修改并提交请求
    handleClose (done) {
      this.$confirm('确定要提交表单吗？')
        .then(async () => {
          this.loading = true
          const res = await this.$axios
            .put(`/users/${this.curr.id}`, {
              params: {
                rid: this.curr.rid
              }
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
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })

          // 按钮加载
          setTimeout(() => {
            this.loading = false
            done()
          }, 700)
        })
        .catch(() => {
          this.$message({
            message: '已取消',
            type: 'warning'
          })
          this.dialog = false
        })
    },

    // 取消分配角色
    cancel () {
      this.dialog = false
      this.$message({
        message: '已取消',
        type: 'warning'
      })
    },
    // 分配角色
    async showSetUserRoleDrawer (user) {
      const _this = this
      this.currUserName = user.username
      // 获取用于角色列表
      const resRole = await this.$axios
        .get('/roles')
        .then(res => {
          const {
            data,
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            _this.roleList = data
          }
        })
        .catch(err => {
          alert('服务器炸了(～﹃～)~zZ')
        })

      // 根据userid查询用户信息获取用户全部信息
      const res = await this.$axios.get(`/users/${user.id}`).then(res => {
        const {
          meta: { msg, status },
          data: { id, rid, username }
        } = res.data
        if (status === 200) {
          this.curr = {
            id,
            rid,
            username
          }
          console.log(this.curr)
        } else {
          this.$message({
            message: msg,
            type: 'error'
          })
        }
      })
      this.dialog = true
    },
    // 请求用户列表
    async getUserList () {
      // 查询
      this.fullscreenLoading = true

      const res = await this.$axios
        .get(
          `/users?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`
        )
        .then(res => {
          const {
            meta: { msg, status },
            data: { users, total }
          } = res.data

          if (status === 200) {
            (this.userList = users),
            (this.total = total),
            setTimeout(() => {
              this.fullscreenLoading = false
            }, 700)
            setTimeout(() => {
              this.$message.success(msg)
            }, 700)
          }
        })
    },

    // 改变用户状态
    async changMsgState (user) {
      const res = await this.$axios
        .put(`/users/${user.id}/state/${user.mg_state}`)
        .then(res => {
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
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
    },
    // 添加用户
    async addUser () {
      this.dialogFormVisibleAdd = false
      const res = await this.$axios.post('/users', this.form).then(res => {
        const {
          meta: { msg, status },
          data
        } = res.data

        if (status === 201) {
          this.$message.success(msg)
          this.getUserList()

          // 清空表单
          for (const key in this.form) {
            if (this.form.hasOwnProperty(key)) {
              this.form[key] = ''
            }
          }
        } else {
          this.dialogFormVisibleAdd = true
          this.$notify.error({
            title: '消息',
            message: msg,
            position: 'bottom-right'
          })
          this.form = {}
        }
      })
    },
    // 编辑用户
    async editUser (user) {
      const res = await this.$axios
        .put(`/users/${this.form.id}`, this.form)
        .then(res => {
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.dialogFormVisibleEdit = false
            this.$message.success(msg)
            this.getUserList()

            // 清空表单
            this.form = {}
          } else {
            this.$message.error(msg)
          }
        })
    },
    // 展示编辑用户对话框
    showEditUserDia (user) {
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    // 弹出删除模拟框
    showDeleUserMsgBox (userId) {
      this.$confirm('是否要删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送删除用户请求
          const res = await this.$axios.delete(`/users/${userId}`).then(res => {
            const {
              meta: { msg, status }
            } = res.data
            if (status === 200) {
              this.$message.success(msg)
              this.getUserList()
            } else {
              this.$message.error(msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 当前页面数条页发生改变
    handleSizeChange (val) {
      this.pageSize = val

      // 回到第一页
      this.pageNum = 1
      this.getUserList()
    },

    // 当前页码改变
    handleCurrentChange (val) {
      this.pageNum = val
      this.getUserList()
    },

    // 搜素用户
    searchUsers () {
      this.pageNum = 1
      this.pageSize = 6
      this.getUserList()
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="scss" scoped>
/deep/.box-card {
  height: 100%;
  .select {
    padding: 30px 0;
  }
  .block {
    padding: 30px 0;
  }
}
</style>
