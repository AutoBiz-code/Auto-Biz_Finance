"use client";
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function FeaturesRedirect() {
  useEffect(() => {
    redirect('/');
  }, []);

  return null;
}
