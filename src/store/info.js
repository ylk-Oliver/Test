import axios from "axios"
export default {
	//命名空间
	namespaced: true,
	//状态管理
	state: {
		arr: [],
		exportArr: [], // 导出所有的数据
		total: 0,
		nowPage: 1,
		pageSize: 25,
		searchMobile: '',
		sizeArray: [25, 50, 100],
		$this: null
	},
	//无副作用方法,唯一用于改变state的地方
	mutations: {
		changeArr(state, {
			arr
		}) {
			state.arr = arr;
		},
		changeExportArr(state, {
			exportArr
		}) {
			state.exportArr = exportArr
		},
		changeTotal(state, {
			total
		}) {
			state.total = total
		},
		changeNowpage(state, {
			nowpage
		}) {
			state.nowPage = nowpage
		},
		changePagesize(state, {
			pagesize
		}) {
			state.pageSize = pagesize
		},
		changeSearchMobile(state, {
			searchmobile
		}) {
			state.searchMobile = searchmobile
		},
		initThis(state, {
			$this
		}) {
			state.$this = $this
		}
	},
	//副作用方法,用于进行逻辑判断,以及拉取数据
	actions: {
		loadInfo({
			state,
			commit
		}) {
			var yaok =
				`http://m1.yaok.com/appapi/brandActivityUser/getBrandActivityUsers?pageNum=${state.nowPage}&pageSize=${state.pageSize}`;
			// var dev = `http://dev.m1.yaok.com/appapi/brandActivityUser/getBrandActivityUsers?pageNum=${state.nowPage}&pageSize=${state.pageSize}`;

			axios.get(yaok).then(function(res) {
				// 去掉加载页面动画
				state.$this.isSpinShow = false;
				// var jsonObj = JSON.parse(data);
				var jsonObj = res.data;
				commit("changeArr", {
					arr: jsonObj.data.items
				});
				var total = jsonObj.data.totalCount;
				commit("changeTotal", {
					total
				});
			}).catch(function(data) {
				state.$this.isSpinShow = false;
			})
		},
		loadExportInfo({ // 导出数据
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				// 加载所有需要导出的数据
				var exportYaok =
					`http://m1.yaok.com/appapi/brandActivityUser/getBrandActivityUsers?pageNum=1&pageSize=1000000`;
				// var exportDev = `http://dev.m1.yaok.com/appapi/brandActivityUser/getBrandActivityUsers?pageNum=1&pageSize=1000000`;
				axios.get(exportYaok).then(function(res) {
					// 去掉加载页面动画
					state.$this.isSpinShow = false;
					var jsonObj = res.data;
					commit("changeExportArr", {
						exportArr: jsonObj.data.items
					});
					// 调用回调函数
					resolve();
				}).catch(function(data) {
					state.$this.isSpinShow = false;
				})
			})
		},
		loadSearchInfo({
			state,
			commit
		}) {
			var yaok =
				`http://m1.yaok.com/appapi/brandActivityUser/getBrandActivityUsers?mobile=${state.searchMobile}&pageNum=${state.nowPage}&pageSize=${state.pageSize}`;
			// var dev = `http://dev.m1.yaok.com/appapi/brandActivityUser/getBrandActivityUsers?mobile=${state.searchMobile}&pageNum=${state.nowPage}&pageSize=${state.pageSize}`;
			if (state.searchMobile == null || state.searchMobile == '') {
				// dev = `http://dev.m1.yaok.com/appapi/brandActivityUser/getBrandActivityUsers?pageNum=1&pageSize=${state.pageSize}`;
				yaok = `http://m1.yaok.com/appapi/brandActivityUser/getBrandActivityUsers?pageNum=1&pageSize=${state.pageSize}`;
			}
			axios.get(yaok).then(function(res) {
				// 去掉加载页面
				state.$this.isSpinShow = false;
				var jsonObj = res.data;
				commit("changeArr", {
					arr: jsonObj.data.items
				});
				// 模糊查询总条数
				var total = jsonObj.data.totalCount;
				console.log("total size of like searching is " + total);
				commit("changeTotal", {
					total
				});
			}).catch(function(data) {
				state.$this.isSpinShow = false;
			})
		},
		changeNowpage({
			commit,
			dispatch,
			state
		}, {
			nowpage
		}) {
			commit("changeNowpage", {
				nowpage
			});

			if (state.searchMobile == null || state.searchMobile == '') {
				dispatch("loadInfo")
			} else {
				dispatch("loadSearchInfo");
			}
		},
		changePagesize({
			commit,
			dispatch,
			state
		}, {
			pagesize
		}) {
			commit("changePagesize", {
				pagesize
			});
			commit("changeNowpage", {
				nowpage: 1
			});

			if (state.searchMobile == null || state.searchMobile == '') {
				dispatch("loadInfo");
			} else {
				dispatch("loadSearchInfo");
			}
		},
		changeSearchMobile({
			commit,
			dispatch,
			state
		}, {
			searchmobile
		}) {
			console.log("changeSearchMobile" + searchmobile);
			commit("changeSearchMobile", {
				searchmobile
			});
			commit("changeNowpage", {
				nowpage: 1
			});
			if (state.searchMobile == null || state.searchMobile == '') {
				dispatch("loadInfo");
			} else {
				dispatch("loadSearchInfo");
			}
		},
		initThis({
			commit
		}, {
			$this
		}) {
			commit("initThis", {
				$this
			});
		}
	}
}
