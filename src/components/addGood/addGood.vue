<template>
  <el-card class="addGood">
    <breadcrumb :level1="level1" :level2="level2"></breadcrumb>
    <!-- 提示 -->
    <el-alert class="alert" title="添加商品信息" type="success" center show-icon :closable="false"></el-alert>

    <!-- 步骤条   -->
    <!-- 1*activeName相乘隐式转换 -->

    <el-steps :active="1*activeName" finish-status="success" simple>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 提交表单提交包裹tabs标签页 -->
    <el-form
      class="form"
      :model="form"
      label-position="top"
      label-width="80px"
      style="overflow: hidden"
    >
      <el-tabs
        @tab-click="changTab()"
        v-model="activeName"
        tab-position="left"
        style="margin-top:20px"
      >
        <el-tab-pane name="1" label="基本信息" style="padding:0 120px;">
          <el-form-item label="名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 级联选择器 -->
            <el-cascader
              clearable
              :props="defaultProps"
              expand-trigger="click"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item.attr_name" v-for="(item, index) in dynamicArry" :key="index">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                :label="item1"
                v-for="(item1, index) in item.attr_vals"
                :key="index"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <!-- 静态参数数据 -->
          <el-form-item :label="item.attr_name" v-for="(item, index) in staticArray" :key="index">
            <el-input v-model="item.attr_vals" label></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- <el-button style="margin:30px 0" type="success" @click="submitUpload">确定上传</el-button> -->
          <el-upload
            ref="upload"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="hangdleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGood()">添加商品</el-button>
            <quillEditor class="editor" v-model="form.goods_introduce"></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  data () {
    return {
      level1: '商品管理',
      level2: '添加商品',
      dialogImageUrl: '',
      dialogVisible: false,
      activeName: '1',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      form: {
        goods_name: '',
        goods_price: '',
        goods_cat: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 级联选择器用的数据
      options: [],
      // 最终选定的值
      selectedOptions: [1, 3, 6],
      //
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      dynamicArry: [],
      staticArray: []
    }
  },
  methods: {
    // 添加商品
    async addGood () {
      // 商品分类
      this.form.goods_cat = this.selectedOptions.join(',')

      let arr1 = this.dynamicArry.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      })
      let arr2 = this.staticArray.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      })
      this.form.attrs = [...arr1, ...arr2]
      const res = await this.$axios
        .post('/goods', this.form)
        .then(res => {
          const {
            data,
            meta: { msg, status }
          } = res.data
          if (status === 201) {
            this.$router.push({ name: 'goodList' })
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {})
    },
    handleRemove (file) {
      let index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      // 数组切掉索引为index一个元素
      this.form.pics.splice(index, 1)
    },
    hangdleSuccess (file) {
      // 图片临时上传地址
      // tmp_path
      const {
        data: { tmp_path, url },
        meta: { msg, status }
      } = file
      if (status === 200) {
        this.form.pics.push({ pic: tmp_path })
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // submitUpload() {
    //   this.$refs.upload.submit();
    // },

    // 点击tab触发事件
    changTab () {
      // 如果点击第二个tab
      if (this.activeName === '2') {
        // 如果三级已选
        if (this.selectedOptions.length !== 3) {
          this.$message.warning('请先选择三级分类')
          return
        }
        // 获取数据
        this.getParameters('many')
      } else if (this.activeName === '3') {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning('请先选择三级分类')
          return
        }
        this.getParameters('only')
      }
    },
    // 点击三级分类触发
    handleChange () {},
    // 获取动态/静态参数
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
    // 获取商品三级联动数据
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
  },
  components: {
    quillEditor
  },
  created () {
    this.getGoodCate()
  }
}
</script>
<style lang="scss" scoped>
/deep/.addGood {
  height: 100%;
  .alert {
    margin: 30px 0;
  }
  .editor {
    padding: 20px 0 20px 0;
  }
  .ql-editor {
    min-height: 200px;
  }
}
</style>
