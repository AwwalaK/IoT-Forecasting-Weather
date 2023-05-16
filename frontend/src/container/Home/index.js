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

  const baca_data = {
    topic: 'raw_data',
    qos: 0,
  }

  const lihat_prediksi = {
    topic: 'result_topic',
    qos: 0,
  }

  const initialConnectionOptions = {
    protocol: 'ws',
    host: '0.tcp.ap.ngrok.io',
    clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
    port: 12136,
  }
  const { protocol, host, clientId, port } = initialConnectionOptions
  const url = `${protocol}://${host}:${port}/mqtt`

  useEffect(() => {
    if (connectStatus !== 'Connected') {
      setConnectStatus('Connecting')
      setClient(mqtt.connect(url))
    }
  }, [])


  const [showElement, setShowElement] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setShowElement(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected')
        setShowElement(true)
        console.log('connection successful web')
      })

      client.on('error', (err) => {
        console.error('Connection error: ', err)
        client.end()
      })

      client.on('reconnect', () => {
        setConnectStatus('Reconnecting')
        setShowElement(true)
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

  console.log(connectStatus)
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
            onClick={()=>mqttSub(baca_data, 'now')}
          >
            Check Weather Now
          </button>
          <button
            className='cursor-pointer bg-white rounded-t-lg px-5 py-2 w-60'
            onClick={()=>mqttSub(lihat_prediksi, 'predict')}
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
        
        {connectStatus === "Connected" && showElement && (
          <div class="flex p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 w-60 absolute bottom-0 right-28" role="alert">
            <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg><span class="font-medium">Connection successful</span>
          </div>
        )}
        {connectStatus === "Reconnecting" && showElement && (
          <div class="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 float-right w-60 absolute bottom-0 right-28" role="alert">
            <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
            <span class="font-medium">Reconnecting</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home