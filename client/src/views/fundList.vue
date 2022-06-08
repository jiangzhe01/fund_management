<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="投标时间筛选:">
          <el-date-picker
            v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间"
          >
          </el-date-picker>
          --
          <el-date-picker
            v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="search"
            @click="onScreeoutMoney()"
            >筛选</el-button
          >
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button
            type="primary"
            size="small"
            icon="view"
            @click="handleAdd()"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        :default-sort="{ prop: 'date', order: 'descending' }"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="70">
        </el-table-column>
        <el-table-column
          prop="date"
          label="创建时间"
          align="center"
          width="250"
          sortable
        >
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{
              $dayjs(new Date(scope.row.date)).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="收支类型"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="describe"
          label="收支描述"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="170">
          <template slot-scope="scope">
            <span style="color: #00d053">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="170">
          <template slot-scope="scope">
            <span style="color: #f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cash"
          label="账户现金"
          align="center"
          width="170"
        >
          <template slot-scope="scope">
            <span style="color: #4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="220">
        </el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          fixed="right"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="edit"
              size="small"
              v-if="user.identity == 'manager'"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="delete"
              size="small"
              v-if="user.identity == 'manager'"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page.sync="paginations.page_index"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <fund-dialog
      :form="form"
      :dialog="dialog"
      @submit="submitForm"
      @reset="reset"
    ></fund-dialog>
  </div>
</template>

<script>
import fundDialog from "@/components/Dialog";
export default {
  name: "fundList",
  data() {
    return {
      allTableData: [],
      filterTableData: [],
      tableData: [],
      dialog: {
        show: false,
        title: "",
        type: "edit",
      },
      search_data: {},
      form: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: "",
      },
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper", // 翻页属性
      },
    };
  },
  components: {
    fundDialog,
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getProfile();
  },
  mounted() {},
  methods: {
    // 点击新增
    handleAdd() {
      this.dialog.title = "新增资金信息管理系统";
      this.dialog.type = "add";
      this.dialog.show = true;
    },
    // 获取表单数据
    getProfile() {
      this.$axios.get("/api/profile").then((res) => {
        console.log(res);
        this.allTableData = res.data.profile;
        this.filterTableData = res.data.profile;
        this.setPaginations();
      });
    },
    // 点击编辑
    handleEdit(row) {
      this.dialog.title = "编辑资金信息管理系统";
      this.dialog.show = true;
      this.dialog.type = "edit";
      this.form = { ...row };
    },
    // 点击删除
    handleDelete(index, row) {
      this.$axios.delete(`/api/profile/delete/${row._id}`).then((res) => {
        this.$message.success("删除成功");
        this.getProfile();
      });
    },
    // 提交新增数据
    submitForm(form) {
      let data = { ...form };
      const url = this.dialog.type == "edit" ? `edit/${data._id}` : "add";
      const message = this.dialog.type == "eidt" ? `修改` : "添加";
      this.$axios
        .post("/api/profile/" + url, data)
        .then((res) => {
          this.$message.success("数据" + message + "成功");
          this.dialog.show = false;
          this.reset();
          this.getProfile();
        })
        .catch((err) => {});
    },
    // 重置数据
    reset() {
      this.form = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: "",
      };
      this.dialog = {
        show: false,
        title: "",
        type: "edit",
      };
    },
    // 切换pageNum
    handleCurrentChange(page) {
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    // 切换pageSize
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    // 筛选时间
    onScreeoutMoney() {
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message.warning("请选择时间区间");
        this.getProfile();
        return;
      }
      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();
      this.allTableData = this.filterTableData.filter((item) => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });
      // 分页数据
      this.setPaginations();
    },
  },
};
</script>

<style lang="scss" scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
