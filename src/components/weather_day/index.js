Component({
  mixins: [],
  data: {
    thumb: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
    footerImg: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png'
  },
  props: {
    weather:{}
  },
  didMount() {
    console.log('didMount',this.weather)
  },
  didUpdate() {
    console.log('didUpdate',this.weather)
  },
  didUnmount() {

  },
  methods: {},
});
