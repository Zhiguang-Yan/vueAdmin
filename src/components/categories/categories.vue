<template>
  <el-card class="categories">
    <breadcrumb :level1="level1" :level2="level2"></breadcrumb>
    <el-col :span="24" style="padding:20px 0">
      <el-button type="primary" @click="openDialog">添加分类</el-button>
    </el-col>
    <!-- treeKey -->
    <!-- childNumKey -->
    <!-- parentKey -->
    <!-- 表格 -->
    <el-table height="500px" :data="categoryList" style="width: 100%">
      <el-tree-grid
        :indentSize="indentSize"
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        childKey="children"
        levelKey="cat_level"
        ile-icon="icon icon-file"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span>{{classMap[scope.row.cat_level]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span>{{judge(scope.row.cat_deleted)}}</span>
        </template>
      </el-table-column>
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
    <!-- 对话框 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form status-icon :rules="rules" ref="ruleForm" :model="form">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="select">
          <!-- 级联选择器 -->
          <el-cascader clearable :props="props" :options="options" v-model="selectedOptions"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import ElTreeGrid from 'element-tree-grid'
export default {
  name: 'categories',
  data () {
    const validateCate = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请填写分类名称'))
      } else {
        callback()
      }
    }
    return {
      // 自定义验证分类
      // 表单验证
      rules: {
        cat_name: [{ validator: validateCate, trigger: 'blur' }]
      },
      indentSize: 20,
      level1: '商品管理',
      level2: '商品分类',
      // 表格绑定的值
      categoryList: [],
      dialogFormVisible: false,
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      // 传入的值
      options: [],
      // 级联选择器选择到的元素
      selectedOptions: [],
      // 三级联动配置
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  methods: {
    async addCate () {
      const _this = this
      const res = await this.$axios.post(`/categories`, this.form).then(res => {
        const {
          meta: { msg, status }
        } = res.data
        if (status === 201) {
          this.$message.success(msg)
          _this.getGoodCate()
        } else {
          this.$message.error(msg)
        }
      })
    },
    openDialog () {
      this.dialogFormVisible = true
    },
    judge (param) {
      if (param === false) {
        return '😊'
      } else {
        return '😡'
      }
    },
    // 确定提交
    determine (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          if (this.selectedOptions.length === 1) {
            this.form.cat_pid = this.form.cat_level = 0
          } else if (this.selectedOptions.length === 2) {
            this.form.cat_pid = this.selectedOptions[0]
            this.form.cat_level = 1
          } else if (this.selectedOptions.length === 3) {
            this.form.cat_pid = this.selectedOptions[1]
            this.form.cat_level = 2
          }
          this.addCate()
        } else {
          this.$message.error('错误提交!!')
          return false
        }
      })
    },
    // 得到三级分类参数
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
            this.categoryList = data
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(err => {})
    }
  },
  created () {
    this.getGoodCate()
    this.classMap = ['一级', '二级', '三级']
  },
  components: {
    ElTreeGrid
  }
}
</script>
<style lang="scss" scoped>
/deep/.categories {
  height: 100%;
}
</style>
