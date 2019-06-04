<template>
	<div id="container" :class="this.GLOBAL.isMobile ? 'style-mobile': 'style-pc'">
		<Spin fix v-show="isSpinShow">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>Loading</div>
		</Spin>

		<div class="head">
			<!-- 搜索 -->
			<Input style="float: left;width: 75%;margin-bottom: 10px;" type="tel" :maxlength="11" search enter-button
			 placeholder="请输入电话号码..." v-model="mobileValue" @on-search="searchByMobile" ref="inputText" clearable @on-keyup="onKeyUp" />
			<Button style="float: left; margin-left: 5px; margin-top: 5px;" type="primary" size="small" @click="exportData()">
				<Icon type="ios-download-outline"></Icon> 导出
			</Button>
		</div>
		<!-- 展示 -->
		<Table style="clear: both;" border :row-class-name="rowClassName" :columns="col" :data="info" ref="table"></Table>
		<!-- 分页条 -->
		<Page :total="total" :page-size="pageSize" show-sizer show-total :current="nowPage" @on-change="changeNowpage"
		 @on-page-size-change="changePagesize" :page-size-opts="sizeArray" />
	</div>
</template>
<script>
	export default {
		created() {
			this.$store.dispatch("info/initThis", {
				$this: this
			});

			if (this.isSpinShow == false) {
				this.isSpinShow = true;
				this.$store.dispatch("info/loadInfo")
			}
		},
		data() {
			if (this.GLOBAL.isMobile) {
				return {
					col: [{
							title: '用户名',
							key: 'username',
							align: 'center'
						},
						{
							title: '注册时间',
							key: 'createTime',
							align: 'center',
							minWidth: 25,
							render: (h, params) => {
								let temp = ''
								if (params.row.createTime == null) {
									temp = '无'
								} else {
									temp = this.timeStamp(params.row.createTime / 1000)
								}
								return h(
									"div", temp
								)
							}
						},
						{
							title: '性别',
							key: 'sex',
							align: 'center'
						},
						{
							title: '电话号码',
							key: 'mobile',
							align: 'center',
							minWidth: 50
						},
						{
							title: '公司',
							key: 'company',
							align: 'center',
							minWidth: 30
						}
					],
					mobileValue: '',
					isSpinShow: false
				}
			} else {
				return {
					col: [{
							title: '编号',
							key: 'index',
							align: 'center',
							render: (h, params) => {
								return h(
									"div", params.row._index + 1 + (this.$store.state.info.nowPage - 1) * this.$store.state.info.pageSize
								)
							}
						},
						{
							title: '用户名',
							key: 'username',
							align: 'center'
						},
						{
							title: '注册时间',
							key: 'createTime',
							align: 'center',
							render: (h, params) => {
								let temp = ''
								if (params.row.createTime == null) {
									temp = '无'
								} else {
									temp = this.timeStamp(params.row.createTime / 1000)
								}
								return h(
									"div", temp
								)
							}
						},
						{
							title: '性别',
							key: 'sex',
							align: 'center'
						},
						{
							title: '电话号码',
							key: 'mobile',
							align: 'center'
						},
						{
							title: '公司',
							key: 'company',
							align: 'center'
						}
					],
					mobileValue: '',
					isSpinShow: false
				}
			}
		},
		computed: {
			info() {
				return this.$store.state.info.arr
			},
			total() {
				return this.$store.state.info.total
			},
			nowPage() {
				return this.$store.state.info.nowPage
			},
			sizeArray() {
				return this.$store.state.info.sizeArray
			},
			pageSize() {
				return this.$store.state.info.pageSize
			}
		},
		watch: {
			mobileValue:function() {
				if(this.mobileValue == '') {
					this.isSpinShow = true;
					this.$store.dispatch("info/changeSearchMobile", {
						searchmobile: this.mobileValue
					})
				}
			}
		},
		methods: {
			rowClassName(row, index) {
				if (index % 2 === 0) {
					return 'demo-table-info-row';
				}
				return '';
			},
			changeNowpage(v) {
				if (this.isSpinShow == false) {
					this.isSpinShow = true;
					this.$store.dispatch("info/changeNowpage", {
						nowpage: v
					});
					// 换页时页面滚动到最顶端
					container.scrollIntoView();
				}
			},
			changePagesize(v) {
				if (this.isSpinShow == false) {
					this.isSpinShow = true;
					this.$store.dispatch("info/changePagesize", {
						pagesize: v
					});
					// 改变 size 时页面滚动到顶端
					container.scrollIntoView();
				}
			},
			searchByMobile() {
				if (this.isSpinShow == false) {
					// 强制让其失去焦点,隐藏键盘
					this.$refs.inputText.blur();
				}
			},
			exportData() {
				// 更新导出数组的数据
				if (this.isSpinShow == false) {
					this.isSpinShow = true;
					this.$store.dispatch("info/loadExportInfo").then(() => {
						// 没有数据不做任何处理
						if (this.$store.state.info.exportArr.length == 0) {
							this.$message.info('当前列表数据为空！');
							return;
						}
						this.$refs.table.exportCsv({
							filename: 'RegistrantInfo' + new Date().getTime(),
							original: false,
							columns: [{
									title: '编号',
									key: 'index',
								},
								{
									title: '用户名',
									key: 'username',
								},
								{
									title: '注册时间',
									key: 'createTime',
								},
								{
									title: '性别',
									key: 'sex',
								},
								{
									title: '电话号码',
									key: 'mobile',
								},
								{
									title: '公司',
									key: 'company',
								}
							],
							data: this.$store.state.info.exportArr.map((v, index) =>
								({ ...v,
									index: index + 1,
									createTime: this.timeStamp(v.createTime / 1000)
								})
							)
						});
					})
				}
			},
			onKeyUp() {
				// 正则表达式，不是数字的替换为 ''
				var self = this;
				self.mobileValue = self.mobileValue.replace(/[^\d]/g, '');
				// 显示加载页
				this.isSpinShow = true;
				this.$store.dispatch("info/changeSearchMobile", {
					searchmobile: this.mobileValue
				})
			}
		}
	}
	//app
</script>
<style scoped lang="less">
	.style-pc {
		width: 60%;
		margin: 0px auto;
		padding: 15px 0px 50px;
	}

	.style-mobile {
		width: 100%;
		margin: 0px auto;
		padding: 15px 0px 50px;
	}

	.style-pc .head {
		width:80%;
		margin: 0px auto;
	}

	.style-mobile .head {
		width:90%;
		margin: 0px auto;
	}
	

	.demo-spin-icon-load {
		animation: ani-demo-spin 1s linear infinite;
	}

	@keyframes ani-demo-spin {
		from {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(180deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
	
</style>

<style>
	.ivu-table .demo-table-info-row td {
		background-color: #2db7f5;
		color: #fff;
	}
	.ivu-input-icon {
		position: absolute;
		right:50px !important;
	}
</style>
