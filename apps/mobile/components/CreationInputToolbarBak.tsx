'use client'

import React, { useEffect, useState } from 'react'
import { Keyboard } from '@capacitor/keyboard'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonMenuButton,
  IonNavLink,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

export function CreationInputToolbar() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    // 监听键盘弹出
    const showHandler = Keyboard.addListener('keyboardWillShow', (info) => {
      setKeyboardHeight(info.keyboardHeight)
    })
    // 监听键盘收起
    const hideHandler = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0)
    })
    // 清理事件
    return () => {
      showHandler.then((handle) => handle?.remove())
      hideHandler.then((handle) => handle?.remove())
    }
  }, [])

  return (
    <IonFooter
      style={{
        marginBottom: keyboardHeight ? `${keyboardHeight}px` : 0,
        transition: 'margin-bottom 0.25s',
      }}
    >
      <IonToolbar>
        <div>this is toolbar</div>
      </IonToolbar>
    </IonFooter>
  )
}
