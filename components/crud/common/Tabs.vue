<template> 
	<section class="tabs">
		<ul class="flex my-2 w-full border-b">
			<li class="mr-2 -mb-px" v-for="(tb, ky) of tabs" :key="ky" >
				<a @click="changeTab(tb)" href="#" :class="{'active': active == tb.name }"
						class="inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold">
					{{ tb.label }}
				</a>
			</li>
		</ul>
	</section>
</template>


<script>
export default {
	name: "Tabs",
  props: {
    context: {
      type: Object,
      default: () => ({ value:{}, options:[] })
    },
  }, 
  computed:{
		tabs() {
			return this.$attrs?.tabs || []
		}
  },
	data(){return{
		active: ''
	}},
	mounted(){
		if( this.tabs?.length === 0 ) return ;

		this.changeTab(this.tabs[0])
		this.active = this.tabs[0].name
	},
  destroyed() {
    this.styleTag.remove();
  },
	methods:{
		changeTab(tb){
			if( this.tabs?.length === 0 ) return ;

			this.active = tb.name

			if( this.styleTag ) this.styleTag.remove();

			const css = `
				${ this.tabs.map(i => i.name).join(',') }{
					display: none;
				} 
			    ${tb.name}{
				  ${ tb.enabledStyle ? `${ tb.enabledStyle } ${ tb.enabledStyle.includes('important') ?'':'!important' }` : 'display: flex !important; flex-direction: column;' }
				}
			`;
			this.styleTag = document.createElement('style');
			this.styleTag.appendChild(document.createTextNode(css));
			document.head.appendChild(this.styleTag);
		}
	}
}
</script>

<style lang="scss">
.tabs{
	ul {
		border-bottom-color: blue;
		li .active{
			color: blue;
			border: 1px solid blue;
			border-bottom-color: white;
		}
	}
}
</style>
// {
// 	"component": "tabs",
// 	"class": "d-flex",
// 	"tab": "num1",
// 	"tabs": [
// 		{
// 			"name": ".tab2",
// 			"label": "ID"
// 		},
// 		{
// 			"name": ".tab3",
// 			"label": "Created"
// 		}
// 	]
// },
// {
// 	"component": "div",
// 	"class": "d-flex tab2",
// 	"tab": "num2",
// 	"children": [
// 		{
// 			"name": "outro",
// 			"label": "OUtro",
// 			"hidden": false,
// 			"config": {
// 				"grid": true
// 			},
// 			"depth": 2
// 		},
// 		{
// 			"name": "outrotrou",
// 			"label": "OUtro",
// 			"config": {
// 				"grid": true,
// 				"sort": 1
// 			},
// 			"depth": 2
// 		}
// 	]
// },
// {
// 	"component": "div",
// 	"class": "d-flex tab3",
// 	"tab": "num3",
// 	"children": [
// 		{
// 			"name": "title",
// 			"label": "Title",
// 			"config": {
// 				"grid": true
// 			},
// 			"depth": 2
// 		},
// 		{
// 			"name": "artist_name",
// 			"label": "Artist",
// 			"config": {
// 				"grid": true,
// 				"sort": 1
// 			},
// 			"depth": 2
// 		}
// 	]
// }