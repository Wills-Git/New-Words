'use client';

import { useEffect, useState } from 'react';
import { trpc } from '@web/app/trpc';

export default function ClientSide() {
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    trpc.hello
      .query({ name: 'scooby' })
      .then(({ greeting }) => setGreeting(greeting));
  }, []);
  return <p>I am client side: {greeting}</p>;
}
