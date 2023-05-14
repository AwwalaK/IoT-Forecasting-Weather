import React, { useEffect, useState } from 'react'
import 'react-tabs/style/react-tabs.css';

import mqtt from 'mqtt'

const nowCard = [
  {
    id: 1,
    title: "Today's Weather",
    href: '#',
    temperature: '27',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    humidity: '80',
    light: '610',
    status: 'Sunny',
  },
]

const next6HourCard = [
  {
    id: 1,
    title: "Weather in 6 Hour ",
    href: '#',
    temperature: '27',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    humidity: '80',
    light: '610',
    status: 'Sunny',
  },
]

const Home = () =>{
  const [client, setClient] = useState(null)
  const [connectStatus, setConnectStatus] = useState('Connect')
  const [content, setContent] = useState('')
  
  const [subscribeWeatherNow, setSubscribeWeatherNow] = useState(false)
  const [subscribeWeatherPredict, setSubscribeWeatherPredict] = useState(false)

  const values = {
    topic: 'outTopic',
    qos: 0,
  }

  const initialConnectionOptions = {
    protocol: 'ws',
    host: 'broker.hivemq.com',
    clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
    port: 8000,
  }
  const { protocol, host, clientId, port } = initialConnectionOptions
  const url = `${protocol}://${host}:${port}/mqtt`

  useEffect(() => {
    if (connectStatus !== 'Connected') {
      setConnectStatus('Connecting')
      setClient(mqtt.connect(url))
    }
  }, [])

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected')
        console.log('connection successful')
      })

      client.on('error', (err) => {
        console.error('Connection error: ', err)
        client.end()
      })

      client.on('reconnect', () => {
        setConnectStatus('Reconnecting')
      })

      client.on('message', (topic, message) => {
        console.log(`received message: ${message} from topic: ${topic}`)
        setContent(`${message}`)
      })
    }
  }, [client])

  const mqttSub = (subscription, type) => {
    if (client) {
      const { topic, qos } = subscription

      if (type === 'now') {
        client.subscribe(topic, { qos }, (error) => {
          if (error) {
            console.log('Subscribe to topics error', error)
            return
          }
  
          console.log(`Subscribe to topics: ${topic}`)
  
          setSubscribeWeatherNow(true)
          setSubscribeWeatherPredict(false)
        })
      }
      else {
        client.subscribe(topic, { qos }, (error) => {
          if (error) {
            console.log('Subscribe to topics error', error)
            return
          }
  
          console.log(`Subscribe to topics: ${topic}`)
  
          setSubscribeWeatherNow(false)
          setSubscribeWeatherPredict(true)
        })
      }
    }
  }

  const mqttUnSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription
      client.unsubscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Unsubscribe error', error)
          return
        }
        console.log(`unsubscribed topic: ${topic}`)
      })
    }
  }

  return (
    <div className="bg-sunny-background py-8 sm:pt-16 h-full">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 sm: pb-10">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Weather Forecast</h2>
          <p className="mt-2 text-lg leading-8 text-white">
            Perkiraan cuaca Kota Bandung
          </p>
        </div>

        <div className='border-b-2'>
          <button 
            className='cursor-pointer bg-white rounded-t-lg px-5 py-2 w-60 mr-10'
            onClick={()=>mqttSub(values, 'now')}
          >
            Check Weather Now
          </button>
          <button
            className='cursor-pointer bg-white rounded-t-lg px-5 py-2 w-60'
            onClick={()=>mqttSub(values, 'predict')}
          >
            Check Predict Weather
          </button>
        </div>

        {subscribeWeatherNow ? nowCard.map((post) => (
          <article key={post.id} className="max-w-xl items-start justify-between">
            <div className="group relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-white">
                <a href={post.href}>
                  <span className="absolute inset-0" />
                  {post.title}
                </a>
              </h3>
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.datetime} className="text-white">
                  {post.date}
                </time>
              </div>
              <h1 className="mt-5 text-9xl text-white">{post.temperature}°C</h1>
            </div>
            <div className='bg-white rounded-lg p-4 w-72 mt-10'>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Humidity</h6>
                <p>{post.humidity} %</p>
              </div>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Light</h6>
                <p>{post.light} Lux</p>
              </div>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Status</h6>
                <p>{post.status}</p>
              </div>
            </div>
          </article>
        )) : ""}
        {subscribeWeatherPredict ? next6HourCard.map((post) => (
          <article key={post.id} className="max-w-xl items-start justify-between">
            <div className="group relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-white">
                <a href={post.href}>
                  <span className="absolute inset-0" />
                  {post.title}
                </a>
              </h3>
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.datetime} className="text-white">
                  {post.date}
                </time>
              </div>
              <h1 className="mt-5 text-9xl text-white">{post.temperature}°C</h1>
            </div>
            <div className='bg-white rounded-lg p-4 w-72 mt-10'>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Humidity</h6>
                <p>{post.humidity} %</p>
              </div>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Light</h6>
                <p>{post.light} Lux</p>
              </div>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Status</h6>
                <p>{post.status}</p>
              </div>
            </div>
          </article>
        )) : ""}
      </div>
    </div>
  )
}

export default Home