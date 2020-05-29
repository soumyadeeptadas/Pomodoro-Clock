function LengthControl(props) {
  const isTimerRunning = props.timerRunning.session || props.timerRunning.break;

  return (
    React.createElement("article", { class: "length-control" },
    React.createElement("h3", { id: `${props.name}-label` }, props.title),
    React.createElement("div", { class: "length-control-body" },
    React.createElement("button", { id: `${props.name}-increment`, onClick: props.onIncrement, disabled: isTimerRunning },
    React.createElement("i", { class: "fas fa-plus" })),


    React.createElement("div", { class: "length", id: `${props.name}-length` }, props.length),

    React.createElement("button", { id: `${props.name}-decrement`, onClick: props.onDecrement, disabled: isTimerRunning },
    React.createElement("i", { class: "fas fa-minus" })))));




}

function Timer(props) {
  const isTimerRunning = props.timerRunning.session || props.timerRunning.break;

  let playStopIcon;

  if (isTimerRunning) {
    playStopIcon = React.createElement("i", { class: "fas fa-pause" });

  } else {
    playStopIcon = React.createElement("i", { class: "fas fa-play" });
  }

  return (
    React.createElement("article", { id: "timer" },

    React.createElement("h2", { id: "timer-label" }, props.title),
    React.createElement("div", { id: "time-left" }, props.timeLeft),

    React.createElement("div", { id: "timer-options" },
    React.createElement("button", { id: "start_stop", title: "start/stop", onClick: props.onTimerControl },
    playStopIcon),


    React.createElement("button", { id: "reset", onClick: props.onReset },
    React.createElement("i", { class: "fas fa-sync" })))));




}

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: '',
      timerTitle: 'Session',
      timerRunning: {
        session: false,
        break: false },

      sessionLength: 25,
      breakLength: 5,
      savedTime: null,
      savedTimerType: '' };


    this.formatTime = this.formatTime.bind(this);
    this.startTimer = this.startTimer.bind(this);

  }

  formatTime(number) {
    let timer = number;
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    this.setState({
      timeLeft: minutes + ':' + seconds });

  }

  handleIncrement(length) {

    if (this.state[length] <= 59) {
      if (length == 'sessionLength') {
        this.setState(state => ({
          timeLeft: (state[length] + 1 < 10 ? '0' + (state[length] + 1) : state[length] + 1) + ':00' }));

      }

      this.setState((state, props) => ({
        [length]: state[length] + 1 }));

    }
  }

  handleDecrement(length) {

    if (this.state[length] > 1) {
      if (length == 'sessionLength') {
        this.setState(state => ({
          timeLeft: (state[length] - 1 < 10 ? '0' + (state[length] - 1) : state[length] - 1) + ':00' }));

      }

      this.setState((state, props) => ({
        [length]: state[length] - 1 }));

    }
  }

  handleReset() {
    let timer = 1500; // 25 mins in seconds

    this.formatTime(timer);

    let timerRunning = { ...this.state.timerRunning, session: false, break: false };

    this.setState(state => ({
      timerTitle: 'Session',
      timerRunning,
      breakLength: 5,
      sessionLength: 25 }));


    clearInterval(this.timerId);
    this.refs.beep.pause();
    this.refs.beep.currentTime = 0;
  }

  startTimer(duration, savedTime = null) {
    let timer, minutes, seconds;
    let pomodoroClass = this;

    timer = savedTime ? --savedTime : (duration *= 60) - 1; // Decreasing the value by 1 so the timer will not do a delay of 1 second after clicking play button

    this.timerId = setInterval(function () {

      if (pomodoroClass.counter++ === 0) {
        if (pomodoroClass.state.timerRunning.break) {

          pomodoroClass.setState(state => ({
            timerTitle: 'Break' }));


          pomodoroClass.formatTime(pomodoroClass.state.breakLength * 60);

        } else if (pomodoroClass.state.timerRunning.session) {

          pomodoroClass.setState(state => ({
            timerTitle: 'Session' }));


          pomodoroClass.formatTime(pomodoroClass.state.sessionLength * 60);

        }
      } else {

        pomodoroClass.formatTime(timer);

        pomodoroClass.setState({
          savedTime: timer });


        if (--timer < 0) {
          timer = duration;
          pomodoroClass.counter = 0;

          if (pomodoroClass.state.timerRunning.session) {

            let timerRunning = { ...pomodoroClass.state.timerRunning, session: false, break: true };

            let minutes = pomodoroClass.state.breakLength;

            pomodoroClass.setState(state => ({
              timerRunning }),
            () => {

              pomodoroClass.refs.beep.play();

              clearInterval(pomodoroClass.timerId);
              pomodoroClass.startTimer(pomodoroClass.state.breakLength);
            });

          } else if (pomodoroClass.state.timerRunning.break) {

            let timerRunning = { ...pomodoroClass.state.timerRunning, session: true, break: false };

            let minutes = pomodoroClass.state.sessionLength;

            pomodoroClass.setState(state => ({
              timerRunning }),
            () => {

              pomodoroClass.refs.beep.currentTime = 0;
              pomodoroClass.refs.beep.play();

              clearInterval(pomodoroClass.timerId);
              pomodoroClass.startTimer(pomodoroClass.state.sessionLength);
            });
          } else {
            return;
          }
        }
      }

    }, 1000);
  }

  handleTimerControl(e) {
    this.refs.beep.pause();
    this.refs.beep.currentTime = 0;

    if (!this.state.timerRunning.session && !this.state.timerRunning.break) {

      let timerRunning = { ...this.state.timerRunning, session: true, break: false };

      this.setState({
        timerRunning });


    }
    // if the user clicked on the button and timer is already running, it will stop
    if (e && this.state.timerRunning.session) {

      let timerRunning = { ...this.state.timerRunning, session: false, break: false };

      this.setState({
        timerRunning,
        savedTimerType: 'session' },
      () => {
        clearInterval(this.timerId);
      });

    } else if (e && this.state.timerRunning.break) {

      let timerRunning = { ...this.state.timerRunning, session: false, break: false };

      this.setState({
        timerRunning,
        savedTimerType: 'break' },
      () => {

        clearInterval(this.timerId);

      });


    } else {

      if (this.state.savedTimerType) {

        let timerRunning = this.state.savedTimerType === 'session' ? { ...this.state.timerRunning, session: true, break: false } :
        { ...this.state.timerRunning, session: false, break: true };

        this.setState({
          savedTimerType: null,
          timerRunning },
        () => {
          this.startTimer(this.state[this.state.savedTimerType + 'Length'], this.state.savedTime);
        });


      } else {

        let timerRunning = { ...this.state.timerRunning, session: true, break: false };

        this.setState({
          timerRunning },
        () => {
          this.startTimer(this.state.sessionLength);
        });

      }

    }

  }

  componentDidMount() {
    let timer = this.state.sessionLength * 60;
    this.formatTime(timer);
  }

  render() {

    return (
      React.createElement("article", { id: "pomodoro" },
      React.createElement(LengthControl, {
        title: "Break Length",
        name: "break", length: this.state.breakLength,
        onIncrement: () => this.handleIncrement('breakLength'),
        onDecrement: () => this.handleDecrement('breakLength'),
        timerRunning: this.state.timerRunning }),


      React.createElement(Timer, {
        title: this.state.timerTitle,
        timeLeft: this.state.timeLeft,
        onReset: () => this.handleReset(),
        onTimerControl: e => this.handleTimerControl(e),
        timerRunning: this.state.timerRunning }),


      React.createElement(LengthControl, {
        title: "Session Length",
        name: "session",
        length: this.state.sessionLength,
        onIncrement: () => this.handleIncrement('sessionLength'),
        onDecrement: () => this.handleDecrement('sessionLength'),
        timerRunning: this.state.timerRunning }),


      React.createElement("audio", {
        id: "beep",
        ref: "beep",
        controls: true, src: "https://dl.dropboxusercontent.com/s/os5ntdtpvzr91qv/274806__barkerspinhead__alarm-timer-watch-countdown.mp3?dl=0" }, "Your browser does not support the",

      React.createElement("code", null, "audio"), " element.")));



  }}


function App() {
  return (
    React.createElement("div", { id: "wrapper" },
    React.createElement("h1", { id: "heading" }, "Pomodoro Clock"),

    React.createElement(Pomodoro, null),

    React.createElement("footer", { className: "main-footer" },
    React.createElement("p", null, "Developed by", React.createElement("a", { href: "https://codepen.io/soumyadeepta_das/", target: "_blank" }, " Soumyadeeta Das")))));



}

ReactDOM.render(React.createElement(App, null), document.getElementById('app-wrapper'));