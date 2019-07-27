;(function (window) {
	
const app =	new Vue({
		data: {
			lists: JSON.parse(window.localStorage.getItem('lists')||'[]'),
			currenting: 'null',
			filterText: ''
		},
		methods:{
			handleSubmit(e){
				let value = e.target.value;
				if(!value.length){
					return
				}
				const lists = this.lists
				lists.push({
					id: this.lists.length == 0 ? this.lists.length : 1,
					content: value,
					completed: false
				})
				e.target.value = ""
			},
			handleDelete(index){
				this.lists.splice(index,1)
			},
			handleChangeAll(e){
				let checked = e.target.checked;
				this.lists.forEach(element => {
					element.completed = checked
				}); 
			},
			handleEdit(list){
				this.currenting = list;
			},
			handleSaveEdit(list,index,e){
				let value = e.target.value
				if(!value){
					this.lists.splice(index,1)
					return
				}
				list.content = value;
				this.currenting = 'null';
			},
			handleCancleEdit(){
				this.currenting = 'null';
			},
			handleClearAllDone(){
				for(let i = 0; i < this.lists.length; i++){
					if(this.lists[i].completed){
						this.lists.splice(i,1);
						i--;
					}
				}
			}
		},
		computed: {
			getTasking:{
				get(){
					return this.lists.filter(t => !t.completed).length;
				},
				set(){
					console.log('getTasking的set方法被调用了')
				},
			},
			toggleAllStat:{
				get(){
					return this.lists.every(t => t.completed)
				},
				set(){
					const checked = !this.toggleAllStat;
					this.lists.forEach(list =>{
						list.completed = checked
					})
				}
			},
			filterLists(){
				switch(this.filterText){
					case 'completed' :
						return this.lists.filter(t => !t.completed)
						break
					case 'active' :
						return this.lists.filter(t => t.completed)
						break
					default:
						return this.lists
				}
			}
		},
		watch: {
			lists: {
				//深度监视，主要是数据对象的子元素发生了改变
				handler(){
					window.localStorage.setItem('lists',JSON.stringify(this.lists))
				},
				deep: true
			}
		},
		directives: {
			focus: {
				inserted(el){
					el.focus()
				}
			}
		}
	}).$mount('#app')


//利用hash值来判断显示状态
window.onhashchange = function(){
	let hash = window.location.hash.substr(2)
	app.filterText = hash
}
})(window);
