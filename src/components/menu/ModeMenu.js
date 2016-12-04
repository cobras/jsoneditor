import { createElement as h, Component } from 'react'
import { toCapital } from '../../utils/stringUtils'
import { findParentNode } from '../../utils/domUtils'

export default class ModeMenu extends Component {
  /**
   * @param {{open, modes, mode, onChangeMode, onRequestClose, onError}} props
   * @param {Object} state
   * @return {JSX.Element}
   */
  render () {
    const { props, state} = this

    if (props.open) {
      const items = props.modes.map(mode => {
        return h('button', {
          key: mode,
          title: `Switch to ${mode} mode`,
          className: 'jsoneditor-menu-button jsoneditor-type-modes' +
              ((mode === props.mode) ? ' jsoneditor-selected' : ''),
          onClick: () => {
            try {
              props.onRequestClose()
              props.onChangeMode(mode)
            }
            catch (err) {
              props.onError(err)
            }
          }
        }, toCapital(mode))
      })

      return h('div', {
        className: 'jsoneditor-actionmenu jsoneditor-modemenu'
      }, items)
    }
    else {
      return null
    }
  }

  componentDidMount () {
    this.updateRequestCloseListener()
  }

  componentDidUpdate () {
    this.updateRequestCloseListener()
  }

  componentWillUnmount () {
    this.removeRequestCloseListener()
  }

  updateRequestCloseListener () {
    if (this.props.open) {
      this.addRequestCloseListener()
    }
    else {
      this.removeRequestCloseListener()
    }
  }

  addRequestCloseListener () {
    if (!this.handleRequestClose) {
      // Attach event listener on next tick, else the current click to open
      // the menu will immediately result in requestClose event as well
      setTimeout(() => {
        this.handleRequestClose = (event) => {
          if (!findParentNode(event.target, 'data-menu', 'true')) {
            this.props.onRequestClose()
          }
        }
        window.addEventListener('click', this.handleRequestClose)
      }, 0)
    }
  }

  removeRequestCloseListener () {
    if (this.handleRequestClose) {
      window.removeEventListener('click', this.handleRequestClose)
      this.handleRequestClose = null
    }
  }

  handleRequestClose = null
}