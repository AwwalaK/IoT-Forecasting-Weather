import { useState } from 'react'
import { Popover } from '@headlessui/react'

export default function Navbar() {

  return (
    <header className="bg-white ">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
        </div>

        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <a href="/" className="text-sm font-semibold leading-6 text-gray-900">
            Forecasting
          </a>
          <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
            About
          </a>
        </Popover.Group>
      </nav>
    </header>
  )
}
