import React from 'react';
import ClickLoginAction from '../_action/login/ClickLogin.action';

export default function LoginBoxArea() {
  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-br from-brand-start via-brand-via to-brand-end">
      <section className="flex flex-col items-center">
        <ClickLoginAction />
      </section>
    </main>
  );
}
