<template>
  <el-card class="cateparams">
    <breadcrumb :level1="level1" :level2="level2"></breadcrumb>
    <el-alert
      title="只允许显示第三级分类设置参数"
      center
      effect="dark"
      show-icon
      :closable="false"
      type="warning"
      style="margin:30px 0"
      close="false"
    ></el-alert>
    <el-form label-position="top">
      <el-form-item label="商品分类">
        <!-- 级联选择器 -->
        <el-cascader
          clearable
          :props="defaultProps"
          expand-trigger="click"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange"
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 标签tabs -->
    <keep-alive>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="danger">设置动态参数</el-button>
          <!-- 展开表格 -->
          <el-table :data="dynamicArry" style="width: 100%">
            <el-table-column type="expand" label="#">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name,tag)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)"
                  @blur="handleInputConfirm(scope.row.attr_vals)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
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
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="second">
          <el-button type="danger">设置静态参数</el-button>

          <el-table :data="staticArray" style="width: 100%">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
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
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </keep-alive>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
      level1: '商品管理',
      level2: '分类参数',
      activeName: 'first',
      // 级联选择器
      options: [],
      // 最终选定的值
      selectedOptions: [],
      // 标签和节点
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数
      dynamicArry: [],
      inputVisible: false,
      staticArray: [],
      inputValue: ''
    }
  },
  methods: {
    // tags点击关闭按钮
    handleClose (dynamicTags, attr_id, attr_name, tag) {
      dynamicTags.splice(dynamicTags.indexOf(tag), 1)
      let putData = {
        attr_name: attr_name,
        attr_sel: 'many',
        attr_vals: dynamicTags.join(',')
      }
      this.editParameter(attr_id, putData)
    },
    // 编辑参数
    async editParameter (param, Data) {
      // categories/:id/attributes/:attrId
      const res = await this.$axios
        .put(`/categories/${this.selectedOptions[2]}/attributes/${param}`, Data)
        .then(res => {
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error('网络炸了')
        })
    },
    // 点击new按钮
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 回车键或者失去焦点
    handleInputConfirm (dynamicTags) {
      let inputValue = this.inputValue
      if (inputValue) {
        dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    showEditUserDia () {},
    showDeleUserMsgBox () {},
    // 点击切换触发事件
    handleClick () {
      if (this.activeName === 'second') {
        if (this.selectedOptions.length === 3) {
          this.getParameters('only')
        }
      }
    },
    // 级联选择器触发事件
    handleChange () {
      if (this.selectedOptions.length === 3) {
        // 获取动态参数
        this.getParameters('many')
      }
    },
    // 获取参数
    async getParameters (param) {
      const res = await this.$axios
        .get(`categories/${this.selectedOptions[2]}/attributes?sel=${param}`)
        .then(res => {
          const {
            data,
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            if (param === 'many') {
              this.dynamicArry = data
              this.dynamicArry.forEach(element => {
                // 字符串转数组
                // 数据可能没有
                //   if (element.length !== 0) {
                //     element.attr_vals = element.attr_vals.trim().split(",");
                //   }
                // 三目表达式
                element.attr_vals =
                  element.length === 0
                    ? []
                    : element.attr_vals.trim().split(',')
              })
            } else {
              // 静态参数
              this.staticArray = data
            }
          }
        })
        .catch(err => {
          this.$message.error('你的网炸了')
        })
    },

    // 得到三级数据
    async getGoodCate () {
      const res = await this.$axios
        .get(`/categories?type=3`)
        .then(res => {
          const {
            data,
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.options = data
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(err => {})
    }
    // 提交编辑参数
  },
  created () {
    this.getGoodCate()
  }
}
</script>
<style lang="scss" scoped>
/deep/.cateparams {
  height: 100%;
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
