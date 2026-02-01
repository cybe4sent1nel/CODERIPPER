'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUBSCRIPTION_PLANS } from '@/lib/enterprise-config';
import { useAuth } from '@/contexts/AuthContext';
import { X, Sparkles, Check, X as XIcon, Shield, CreditCard, Clock, Headphones } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightedFeature?: string;
}

export default function PricingModal({ isOpen, onClose, highlightedFeature }: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();

  const plans = ['free', 'pro', 'team', 'enterprise'] as const;

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      onClose();
      return;
    }
    
    if (planId === 'enterprise') {
      // In a real app, open a contact form
      window.open('mailto:sales@coderipper.dev?subject=Enterprise%20Plan%20Inquiry', '_blank');
      return;
    }
    
    // In a real app, integrate with Stripe
    alert(`This would redirect to Stripe checkout for the ${planId} plan.`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl my-8 overflow-hidden rounded-3xl bg-card border border-border shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />

          <div className="relative p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-600 dark:text-violet-400 text-sm mb-4">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Limited time: 17% off yearly plans!
                </span>
              </motion.div>
              <h2 className="text-4xl font-bold text-foreground mb-3">
                Choose Your Perfect Plan
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Unlock the full potential of CodeRipper with our premium features.
                Start with free, upgrade when you need more.
              </p>
            </div>

            {/* Billing toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-muted border border-border">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Yearly
                  <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((planKey, index) => {
                const plan = SUBSCRIPTION_PLANS[planKey];
                const price = billingCycle === 'yearly' && 'yearlyPrice' in plan && plan.yearlyPrice
                  ? Math.round(plan.yearlyPrice / 12)
                  : plan.price;
                const isCurrentPlan = user?.plan === planKey;

                return (
                  <motion.div
                    key={planKey}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className={`relative rounded-2xl p-6 ${
                      plan.highlighted
                        ? 'bg-gradient-to-br from-violet-600/20 to-blue-600/20 border-2 border-violet-500/50 shadow-xl shadow-violet-500/10'
                        : 'bg-muted/30 border border-border'
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white'
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {plan.badge}
                      </div>
                    )}

                    {/* Plan name */}
                    <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      {plan.price !== null ? (
                        <>
                          <span className="text-4xl font-bold text-foreground">${price}</span>
                          <span className="text-muted-foreground">/mo</span>
                          {billingCycle === 'yearly' && 'yearlyPrice' in plan && plan.yearlyPrice && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Billed ${plan.yearlyPrice}/year
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-foreground">Custom Pricing</span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(planKey)}
                      disabled={isCurrentPlan}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all mb-6 ${
                        isCurrentPlan
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                          : plan.highlighted
                            ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-500/25'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {isCurrentPlan ? (
                        <span className="flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" /> Current Plan
                        </span>
                      ) : plan.buttonText}
                    </button>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.slice(0, 8).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XIcon className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm">Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">7-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <p className="text-center text-muted-foreground text-sm mt-6">
              Have questions? Check out our{' '}
              <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">FAQ</a>
              {' '}or{' '}
              <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">contact support</a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
