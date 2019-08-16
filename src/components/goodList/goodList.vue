<template>
  <el-card
    class="goodList"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="正在加载中"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <breadcrumb :level1="level1" :level2="level2"></breadcrumb>

    <el-row :gutter="10" class="breadcrumb">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="query" :clearable="true">
          <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="success" @click="addGood">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->

    <el-table :data="goodList" height="450px" width="100%" :border="true">
      <el-table-column label="#" width="50" type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量(克)" width="120"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.upd_time | fmtdate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="medium"
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-delete"
            size="medium"
            @click="showDeleUserMsgBox(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20,60,100,300]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'goodList',
  data () {
    return {
      level1: '商品管理',
      level2: '商品列表',
      fullscreenLoading: false,
      query: '',
      total: 1,
      pageNum: 1,
      pageSize: 10,
      // 商品列表
      goodList: []
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    addGood () {
      this.$router.push({ name: 'addGood'})
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getGoods()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getGoods()
    },
    async getGoods () {
      // 查询
      this.fullscreenLoading = true

      const res = await this.$axios
        .get(
          `/goods?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`
        )
        .then(res => {
          const {
            meta: { msg, status },
            data: { goods, total }
          } = res.data

          if (status === 200) {
            (this.goodList = goods),
            (this.total = total),
            setTimeout(() => {
              this.fullscreenLoading = false
            }, 700)
            setTimeout(() => {
              this.$message.success(`商品${msg}`)
            }, 700)
          }
        })
    },
    searchGoods () {
      this.getGoods()
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.goodList {
  height: 100%;
  .breadcrumb {
    margin: 30px 0;
  }
  .block {
    margin: 30px 0;
  }
}
</style>
