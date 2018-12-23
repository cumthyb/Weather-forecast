Component({
  mixins: [],
  data: {
    thumb: 'https://6465-demo-57510e-1257978613.tcb.qcloud.la/miniWeather/images/lifestyle/lifestyle_sport.png',
  },
  props: {
    suggestion:{}
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
