"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Zap, Users, TrendingUp, Star, Clock, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [currentBid, setCurrentBid] = useState(1250)
  const [timeLeft, setTimeLeft] = useState(3600) 
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBid((prev) => prev + Math.floor(Math.random() * 50) + 10)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleItems = ()  => {
    router.push("/items");
  }

  const signup = () => {
    router.push("/signup");
  }

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Art Collector",
      content: "BidWin transformed how I acquire pieces. The real-time bidding is thrilling!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Antique Dealer",
      content: "Secure, fast, and reliable. I've won over 50 auctions here.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Vintage Enthusiast",
      content: "The user experience is incredible. I love the live notifications!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
        <div className="absolute inset-0 bg-[url('/abstract-auction-pattern.png')] opacity-5"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
              <Badge variant="secondary" className="w-fit animate-pulse-glow">
                🔥 Live Auctions Now
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold font-[family-name:var(--font-space-grotesk)] leading-tight">
                Win Big with
                <span className="text-primary block">Smart Bidding</span>
              </h1>
              <p className="text-xl text-muted-foreground font-[family-name:var(--font-dm-sans)] leading-relaxed">
                Join thousands of bidders in the most exciting auction platform. Secure transactions, real-time updates,
                and endless opportunities to win.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleItems}  size="lg" className="text-lg px-8 py-6 animate-pulse-glow">
                  Start Bidding Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Live Auction Card */}
            <div className={`${isVisible ? "animate-float" : "opacity-0"}`}>
              
              <Card className="max-w-sm w-full flex">
              <CardHeader>
              <CardTitle>Vintage Rolex Submariner</CardTitle>
              <CardDescription>1960s Classic Timepiece</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

              <img 
                src="https://img.auctiva.com/imgdata/1/6/2/9/2/5/4/webimg/988762458_o.jpg"
                alt="Vintage Rolex Watch" 
                className="w-[100px] h-[100px] rounded-xl shadow-lg" 
              />

              </CardContent>
              
        </Card>
                 
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
              Why Choose BidWin?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of online auctions with our cutting-edge platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Transactions",
                description: "Bank-level security with encrypted payments and fraud protection",
              },
              {
                icon: Zap,
                title: "Real-Time Bidding",
                description: "Lightning-fast updates with live notifications and instant confirmations",
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                description: "Track your bidding history and get insights to improve your strategy",
              },
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">See what our community says about their bidding experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-6">
            Ready to Start Winning?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join BidWin today and discover a world of exciting auctions. Your next great find is just one bid away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
            onClick={signup}
             size="lg" variant="secondary" className="text-lg px-8 py-6">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={handleItems}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Browse Auctions
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
