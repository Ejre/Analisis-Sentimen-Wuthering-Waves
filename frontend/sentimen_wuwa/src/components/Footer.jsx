// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white shadow py-4 text-center text-gray-600 text-sm fixed bottom-0 w-full z-50">
      &copy; {new Date().getFullYear()} Sentimen Wuthering Waves. All rights reserved.
    </footer>
  );
}
