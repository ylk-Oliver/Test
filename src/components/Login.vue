<template>
	<div id="login" :class="this.GLOBAL.isMobile ? 'style-mobile': 'style-pc'">
		<img src="../assets/logo.png" />
		<el-form class="form" ref="form" :model="form" label-width="80px">
			<el-input v-model="form.username" placeholder="请输入用户名" style="margin-bottom: 10px;"></el-input>
			<el-input type="password" v-model="form.password" placeholder="请输入密码" style="margin-bottom: 10px;"></el-input>
			<div>
				<el-button type="primary" @click="login">确定登录</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'login',
		data() {
			return {
				form: {
					username: '',
					password: ''
				}
			}
		},
		components: {

		},
		methods: {
			login() {
				this.toLogin();
			},
			toLogin() {

				console.log(this.form.username);
				if (this.form.username == 'admin' && this.form.password == 'yaok123') {
					//登录状态 15 天后过期
					let expireDays = 1000 * 60 * 60 * 24 * 15;
					this.setCookie('session', 'login success', expireDays);
					this.isLoging = false;
					//登录成功后
					this.$router.push('/RegistrantInfo');
				} else {
					// alert('用户名或密码错误，请重试！');
					//this.$alert('用户名或密码错误，请重试！', '错误提示', { confirmButtonText: '确定', callback:{}}); 
					this.$message.info('用户名或密码错误，请重试！');
				}
			}
		}
	}
</script>

<style>
	.style-pc {
		width: 60%;
		margin: 0px auto;
	}

	.style-pc img {
		width: 90%;
		height: 60%;
	}

	.style-pc .form {
		width: 60%;
		margin: 0px auto;
		padding: 10px;
	}

	.style-mobile {
		width: 100%;
		margin: 0px auto;
	}

	.style-mobile img {
		width: 100%;
		height: 100%;
	}

	.style-mobile .form {
		width: 70%;
		margin: 0px auto;
		padding: 10px;
	}
</style>
