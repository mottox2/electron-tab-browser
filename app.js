import React, { Component } from 'react'
import { render } from 'react-dom'

class Tab extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let webview = this.refs.webview

    webview.addEventListener("dom-ready", () => {
      //webview.openDevTools();
      console.log(webview.getUrl())
      this.updateTab(webview.getTitle())
    });

    webview.addEventListener("new-window", (e) => {
      console.log("new-window")
      this.props.createTab(e.url)
    });
  }

  updateTab(title) {
    this.props.updateTab({
      url: this.props.url,
      title: title
    }, this.props.index)

  }

  render() {
    return <webview ref="webview" id="mainWebview" src={this.props.url} autosize="on" style={{'display': this.props.visible ? 'block' : 'none'}}></webview>
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      tabs: [
        { url: "http://qiita.com", title: "" },
        { url: "http://google.com", title: "" },
        { url: "https://www.chatwork.com", title: "" }
      ],
      current: 0
    }
  }

  updateTab(tab, index) {
    var newTabs = this.state.tabs.concat();
    newTabs[index] = tab
    this.setState({tabs: newTabs})
  }

  createTab(url="http://qiita.com") {
    let newTab = {
      url: url,
      title: ""
    }
    let newTabs = this.state.tabs.concat()
    newTabs.push(newTab)
    this.setState({
      tabs: newTabs,
      current: this.state.tabs.length
    });
  }

  closeTab(index) {
    let newTabs = this.state.tabs
    newTabs.splice(index, 1);
    let nextCurrent = this.state.current;

    if (newTabs.length < 1) {
      // quit application
    } else if (index <= this.state.current) {
      nextCurrent = --nextCurrent;
    }
    this.setState({
      tabs: newTabs,
      current: nextCurrent
    })
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  render() {
    return (
      <div>
        <div className="tab-group">
          {this.state.tabs.map((tab, index) => {
            return (
              <div key={index}
                   className={index == this.state.current ? "tab-item active" : "tab-item"}
                   onClick={() => {this.setState({current: index})}}>
                <span className="icon icon-cancel icon-close-tab" onClick={(e) => {
                  this.closeTab(index);
                  e.stopPropagation()
                    return false
                }}></span>
                {this.state.tabs[index].title}
              </div>
            )
          })}
          <div className="tab-item tab-item-fixed" onClick={() => {
            this.createTab();
          }}>
            <span className="icon icon-plus"></span>
          </div>
        </div>
        {this.state.tabs.map((tab, index) => {
          return <Tab key={index}
                      index={index}
                      url={tab.url}
                      visible={this.state.current == index}
                      updateTab={this.updateTab.bind(this)}
                      createTab={this.createTab.bind(this)} />
        })}
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('app')
)
