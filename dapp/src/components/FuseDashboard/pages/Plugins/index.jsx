import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import Plugin from 'components/FuseDashboard/components/Plugin'
import { loadModal } from 'actions/ui'
import { PLUGIN_INFO_MODAL } from 'constants/uiConstants'
import Puzzle from 'images/puzzle.svg'
import { useStore } from 'store/mobx'
import { observer } from 'mobx-react'
import { generalPlugins } from 'constants/plugins'
import includes from 'lodash/includes'
import get from 'lodash/get'
import { isOwner } from 'actions/owner'
import { addressShortener } from 'utils/format'
import { SWITCH_ACCOUNT_MODAL } from 'constants/uiConstants'

const PluginList = ({ pluginList, showInfoModal, addPlugin, togglePlugin }) => {
  return (
    <div className='plugins__items__wrapper'>
      <h5 className='plugins__items__title'>Choose the plugin you want to add</h5>
      <div className='grid-x grid-margin-x grid-margin-y'>
        {
          pluginList.map(({
            title,
            coverImage,
            disabled,
            subTitle,
            modalCoverPhoto,
            key,
            text,
            content,
            website
          }) => {
            return (
              <Plugin
                text={text}
                key={title}
                subTitle={subTitle}
                disabled={disabled}
                title={title}
                pluginKey={key}
                image={coverImage}
                managePlugin={() => addPlugin(togglePlugin(key))}
                showInfoModal={() => showInfoModal(key, {
                  coverImage: modalCoverPhoto,
                  title,
                  disabled,
                  content,
                  website
                })}
              />
            )
          })
        }
      </div>
    </div>
  )
}

const Plugins = () => {
  const dispatch = useDispatch()
  const test = dispatch(isOwner({accountAddress: '0xd57734e44B89fF20c5B0182c8e3C7a36c16F73e5', communityAddress: 'a'}))
  const { dashboard } = useStore()
  const { address: communityAddress } = useParams()
  const showInfoModal = (key, props) => {
    dispatch(loadModal(PLUGIN_INFO_MODAL, {
      ...props,
      pluginName: key,
      hasPlugin: includes(dashboard?.addedPlugins, key),
      managePlugin: () => addPlugin(togglePlugin(key))
    }))
  }

  const openModal = () => {
    dispatch(loadModal(SWITCH_ACCOUNT_MODAL, {
      community: 'Community Name',
      user: addressShortener('0x33aA9744fc11E41C4d0E0441A58d706970b73A3e'),
      account: addressShortener('0x33aA9744fc11E41C4d0E0441A58d706970b652189'),
    }))
  }

  useEffect(() => {
    openModal()
    console.log('test')
    return () => {
    }
  }, [])

  const handleTracker = (plugin) => {
    if (window && window.analytics) {
      const { name } = plugin
      window.analytics.track(`plugin ${plugin.isRemoved ? 'removed' : 'added'}`, { name })
    }
  }

  const addPlugin = (plugin) => {
    handleTracker(plugin)
    dashboard.addCommunityPlugin({ communityAddress, plugin })
    if (plugin.name === 'bridge' && dashboard?.plugins?.bridge?.isRemoved) {
      dashboard.addBridgePlugin({ bridgeType: 'multi-amb-erc20-to-erc677', bridgeDirection: 'home-to-foreign' })
    }
  }

  const togglePlugin = (key) => {
    const plugin = { name: key }
    if (dashboard?.plugins) {
      if (get(dashboard?.plugins, `${key}.isRemoved`, true)) {
        plugin.isRemoved = false
        plugin.isActive = true
      } else {
        plugin.isRemoved = true
        plugin.isActive = false
      }
    }
    return plugin
  }

  return (
    <div className='plugins'>
      <h2 className='plugins__title'>Plugins</h2>
      <div className='plugins__wrapper'>
        <div className='plugins__content__wrapper'>
          <div className='plugins__content'>
            Plug-ins are contracts deployed on the Fuse chain that allow you to add functionality to your app with the click of a button.
            Any plug-in you activate will open a new navigation menu that allows you to configure it's settings.
            Give it try!
          </div>
          <div className='plugins__puzzle'><img src={Puzzle} /></div>
        </div>
        <PluginList
          pluginList={generalPlugins}
          showInfoModal={showInfoModal}
          addPlugin={addPlugin} togglePlugin={togglePlugin}
        />
      </div>
    </div>
  )
}

export default observer(Plugins)
