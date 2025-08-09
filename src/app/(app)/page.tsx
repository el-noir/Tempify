'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Package, Users, Zap, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Create Your Temporary Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Launch your pop-up store in minutes. Sell products, manage inventory, and grow your business with our powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/stores">
                <Button size="lg" variant="secondary" className="text-indigo-600 hover:text-indigo-700">
                  <Store className="w-5 h-5 mr-2" />
                  Browse Stores
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Sell Online
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From setup to sales, we've got you covered with powerful tools and features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Setup</h3>
              <p className="text-slate-600">
                Create your store in minutes with our intuitive setup process. No technical skills required.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Product Management</h3>
              <p className="text-slate-600">
                Easily add, edit, and manage your products with inventory tracking and pricing controls.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Customer Reach</h3>
              <p className="text-slate-600">
                Reach customers worldwide with our public store discovery and social sharing features.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-slate-600">Active Stores</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-slate-600">Products Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-slate-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">99%</div>
              <div className="text-slate-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands of entrepreneurs who are already using Tempify to grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Create Your Store
                </Button>
              </Link>
              <Link href="/stores">
                <Button size="lg" variant="outline">
                  Explore Stores
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
