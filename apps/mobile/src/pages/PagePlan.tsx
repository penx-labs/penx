import React from 'react'
import { LoginContent } from '@/components/Login/LoginContent'
import { EmailLoginForm } from '@/components/Login/EmailLoginForm'
import { RegisterForm } from '@/components/Login/RegisterForm'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonNavLink,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'

const platform = Capacitor.getPlatform()

export function PagePlan() {
  return (
    <>
      <IonHeader
        className={platform === 'android' ? 'safe-area' : ''}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        }}
      >
        <IonToolbar
          className="toolbar"
          style={{
            '--border-width': 0,
            // borderBottom: scrolled ? '1px solid #eeee' : 'none',
            // borderBottom: 'none',
            // border: 'none',
          }}
        >
          <IonButtons slot="start">
            <IonBackButton text=""></IonBackButton>
          </IonButtons>
          <IonTitle>
            <Trans>Plan</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-padding content">
        <LoginContent />
      </IonContent>
    </>
  )
}
