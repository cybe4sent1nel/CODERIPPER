import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { HomeIcon } from '@heroicons/react/24/outline'
import { Button } from '../components/ui/Button'

export default function Custom404() {
  return (
    <>
      <NextSeo
        title="Page Not Found - CodeRipper"
        description="The page you're looking for doesn't exist."
        noindex={true}
      />
      
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="CodeRipper Logo" 
                  width={64} 
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
              
              <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
              <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link href="/">
                <Button size="lg" className="w-full">
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Go to Editor
                </Button>
              </Link>
              
              <Link href="/landing">
                <Button variant="outline" size="lg" className="w-full">
                  View Landing Page
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}