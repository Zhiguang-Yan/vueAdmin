<template>
  <el-card
    class="orderList"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="正在加载中"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <breadcrumb :level1="level1" :level2="level2"></breadcrumb>

    <!-- 表格 -->
    <el-table
      style="width: 100%;margin:30px 0"
      height="450px"
      :data="dataList"
      border
      empty-text="没有订单数据"
    >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格(元)"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-popover placement="top-start" trigger="hover">
            <p>支付类型: {{ scope.row.order_fapiao_title }}</p>
            <div slot="reference">
              <el-tag size="medium" type="success" v-if="scope.row.pay_status==='0'">已付款</el-tag>
              <el-tag size="medium" v-else type="danger">未付款</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.update_time | fmtdate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="primary" circle plain icon="el-icon-edit"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区">
          <el-cascader
            clearable
            :props="defaultProps"
            :options="cityData"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" clearable>
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>
<script>
import cityData from './city_data2017_element'
export default {
  name: 'orderList',
  data () {
    return {
      level1: '订单管理',
      level2: '订单列表',
      dataList: [],
      query: '',
      pageNum: 1,
      pageSize: 20,
      total: -1,
      fullscreenLoading: false,
      dialogFormVisible: false,
      form: {
        address: ''
      },
      // 省市区的数据
      cityData: [],
      selectedOptions: [],
      defaultProps: {
        label: 'label',
        children: 'children',
        value: 'value'
      }
    }
  },
  methods: {
    async getList () {
      this.fullscreenLoading = true
      const res = await this.$axios
        .get(
          `/orders?query=${this.query}&pagenum=${this.pageNum}&pagesize=${this.pageSize}`
        )
        .then(res => {
          const {
            data: { goods, total },
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.dataList = goods
            this.total = total
            // this.$nextTick(() => {
            //   this.fullscreenLoading = false;
            // });
            setTimeout(() => {
              this.fullscreenLoading = false
              this.$message.success(msg)
            }, 700)
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error('服务网络炸了')
        })
    },

    openDialog (id) {
      this.dialogFormVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getList()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getList()
    }
  },
  watch: {
    selectedOptions (newVal) {
      this.form.address = newVal.join('/')
    }
  },
  created () {
    this.cityData = cityData
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
/deep/.orderList {
  height: 100%;
}
</style>
