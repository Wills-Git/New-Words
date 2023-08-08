import { trpc } from '@web/app/trpc';
import{ useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link';

export default function Home() {

  async function greeting(){
      const { greeting } = await trpc.hello.query({ name: 'yofel' });
      return greeting
  }
  console.log(greeting);



  return (
    <div className='p-4'>
      <h1 className='font-bold mb-6'> Home Page</h1>
      <div className="mb-6 flex gap-3">
        <Link href='api/auth/signin'>
          <p className="bg-emerald-400 text-sm rounder px-3 py-1 text-white">sign in</p>
        </Link>
      </div>
    </div>
  );



  return <div>{greeting()}</div>;
}
