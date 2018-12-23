

Component({
  mixins: [],
  data: {
    time:"",
    cloudImgUrl:""
  },
  props: {
    weather:{}
  },
  didMount() {
    this.setData({
      time:this.getHour(this.props.weather.time)
    })
  },
  didUpdate() {
  },
  didUnmount() {},
  methods: {
    getHour(dateTimeStr){
      return (new Date(dateTimeStr)).getHours()
    }
  },
});
