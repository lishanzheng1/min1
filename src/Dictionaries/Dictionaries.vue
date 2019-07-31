<template>
    <div class="el-main">
        <el-row style="float: left">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">基础服务</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(tops,index) in toplist" @click="topclick(index)">{{tops.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <el-table :data="list">
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="编辑字典[项]名称" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button  type="primary" icon="el-icon-search"
                               @click="handleEnd(scope.$index, scope.row)"></el-button>
                    <el-button  type="info"  icon="el-icon-edit"
                               @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button  icon="el-icon-delete"  type="danger"
                               @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button style="float: left" type="primary" size="medium" @click="adduser()">新增</el-button>
      <!--  <el-button @click="userfrist">首页</el-button>
        <el-pagination
                style="display: inline-block"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size=pagesize
                layout="prev, pager, next,jumper"
                :total=total>
        </el-pagination>
        <el-button @click="userlast">尾页</el-button>&ndash;&gt;-->
        <pages
                :total='total'
                :currentPage='currentPage'
                :pageSize='pagesize'
                @handleCurrentChangeSub="handleCurrentChange"
        ></pages>
        <el-dialog title="编辑字典[项]" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="字典名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import {queryDictForPage} from '../api'
    import {dictInsert} from '../api'
    import {dictDelete} from '../api'
    import {queryDictOne} from '../api'
    import {dictUpdate} from '../api'
    export default {
        components: {
            ElCol,
            ElButton,
            ElRow
        },
        data() {
            return {
                input: '',
                dialogFormVisible: false,
                form: {
                    name: '',
                    password: '',
                    state: '',
                    address: '',
                    role: '',
                    fid: '',
                    _id: ''
                },
                toplist: [{
                    fid: '0',
                    name: '字典管理'
                }
                ],
                index: '',
                formLabelWidth: '120px',
                update: false,
                list: [],
                total: 1000,//默认数据总数
                pagesize: 10,//每页的数据条数
                currentPage: 1,//默认开始页面
                id: '',
                fid: 0,
            }
        },
        methods: {
            //导航条点击事件
            topclick(index) {
                let fid = this.toplist[index].fid;
                this.fid=fid;
                this.queryDictForPageChSon(fid, this.currentPage, this.pagesize);
                let unmber = this.toplist.length - index;
                this.toplist.splice(index + 1, unmber);
            },
            //回填
            handleEdit(index, row) {
                this.index = index;
                this.dialogFormVisible = true;
                console.log(row._id);
                this.form = row;
                //中断form和list集合的联动，list重新获取一下数据
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
                this.update = true;
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('确定要删除该记录吗?', '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    this.dictDelete(row._id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            adduser() {
                //清空字典名称
                this.form.name = "";
                this.dialogFormVisible = true;
                this.dictInsert();

            },
            //修改和增加
            add() {
                //true是修改
                if (this.update) {
                    let tableName = this.form.name;
                    let tableId = this.form._id;
                    this.dictUpdate(tableId, tableName);

                    this.update = false;
                }
                //false是添加
                else {
                    let fid = this.id;
                    //判断fid是为空
                    //初始值为空代表父级
                    //有值的话代表的是子级
                    if (fid == "") {
                        fid = 0;
                    }
                    let name = this.form.name;
                    this.dictInsert(name, fid);
                    this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
                }
                this.dialogFormVisible = false
            },
            //查询
            selectuser() {
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                console.log('我是下拉的数据', this.pagesize);//每页下拉显示数据
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //首页
            userfrist() {
                this.currentPage = 1;
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //尾页
            userlast() {
                //向上取整，因为有时候会有小数
                this.currentPage = Math.ceil(this.total / this.pagesize);
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //查看下一级
            handleEnd(index, row) {
                //把id和name放进toplist 导航条根据name显示，数据根据fid查询 下一级的fid等于上一级的id
                this.toplist.push({fid: row._id, name: row.name});
                this.fid = row._id;
                //把id存起来
                this.id = this.list[index]._id;
                this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
            },
            //分页查询数据
            async queryDictForPageChSon(fid, page, rows) {
                try {
                    let result = await queryDictForPage({fid: fid, page: page, rows: rows}, "GET");
                    if (result.code == 0) {
                        this.list = result.data.list;
                        this.total = result.data.count;
                    }
                    else {
                        this.$message.error('获取列表失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //字典增加
            async dictInsert(name, fid) {
                try {
                    let result = await dictInsert({name: name, fid: fid}, "POST");
                    if (result.code == 0) {
                        this.$message.success('添加成功00');
                    }
                    else {
                        this.$message.error('添加失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //字典删除
            async dictDelete(id) {
                try {
                    let result = await dictDelete({id: id}, "GET");
                    console.log(result);
                    if (result.code == 0) {
                        this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
                        if (result.data.status === -1) {
                            this.$message.error('字典还有对应的字典项无法删除');
                        }
                    }
                    else {
                        this.$message.error('删除失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //字典单条查询
            async queryDictOne(id) {
                try {
                    let result = await queryDictOne({id: id}, "GET");
                    if (result.code == 0) {
                        this.$message.success('回填成功')
                    }
                    else {
                        this.$message.error('回填失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            //字典修改
            async dictUpdate(id, name) {
                try {
                    let result = await dictUpdate({id: id, name: name}, "POST");
                    if (result.code == 0) {
                        this.$message.success('修改成功');
                        this.queryDictForPageChSon(this.form.fid, this.currentPage, this.pagesize);
                    }
                    else {
                        this.$message.error('修改失败');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            }
        },
        //在渲染成html后调用 获取字典数据
        mounted() {
            this.queryDictForPageChSon(this.fid, this.currentPage, this.pagesize);
        },
    }
</script>
<style>
    .el-main {
    }

    .el-main button {
        margin-left: 20px !important;
    }

    em {
        font-style: normal;
        margin-right: 10px;
    }

    li {
        display: inline-grid;
    }
</style>
