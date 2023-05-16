import React, { useEffect, useState } from 'react'
import 'react-tabs/style/react-tabs.css';

import mqtt from 'mqtt'

const Home = () =>{
  const [client, setClient] = useState(null)
  const [connectStatus, setConnectStatus] = useState('Connect')
  const [showElement, setShowElement] = useState(true);

  const [contentReadTempHum, setContentReadTempHum] = useState('')
  const [contentReadLight, setContentReadLight] = useState('')

  const matchesTempHum = contentReadTempHum.match(/(\d{4}-\d{2}-\d{2})_(\d{2}:\d{2}) \| Temp: (\d+\.\d+)ºC Hum: (\d+\.\d+)/);
  const matchesLight = contentReadLight.match(/(\d{4}-\d{2}-\d{2})_(\d{2}:\d{2}) \| Light: (\d+)/);

  const date = matchesTempHum?.[1];
  const time = matchesTempHum?.[2];
  const temperature = matchesTempHum?.[3];
  const humidity = matchesTempHum?.[4];
  const light = matchesLight?.[3]

  const [contentPredict, setContentPredict] = useState('')
  
  const [subscribeWeatherNow, setSubscribeWeatherNow] = useState(false)
  const [subscribeWeatherPredict, setSubscribeWeatherPredict] = useState(false)

  const baca_data_temp_hum = {
    topic: 'raw_data',
    qos: 0,
  }

  const baca_data_light = {
    topic: 'raw_data2',
    qos: 0,
  }

  const lihat_prediksi = {
    topic: 'result_topic',
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
    setTimeout(function () {
      setShowElement(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected')
        setShowElement(true)
        // console.log('connection successful web')
      })

      client.on('error', (err) => {
        // console.error('Connection error: ', err)
        client.end()
      })

      client.on('reconnect', () => {
        setConnectStatus('Reconnecting')
        setShowElement(true)
      })

      client.on('message', (topic, message) => {
        if (topic === 'result_topic') {
          setContentPredict(JSON.parse('{"prediction_value": "0", "confidence_value": "1.0"}'))
        }
        else if (topic === 'raw_data') {
          setContentReadLight(`${message}`)
        }
        else if (topic === 'raw_data2') {
          setContentReadTempHum(`${message}`)
        }
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
  
          setSubscribeWeatherNow(true)
        })
      }
      else {
        client.subscribe(topic, { qos }, (error) => {
          if (error) {
            console.log('Subscribe to topics error', error)
            return
          }
          setSubscribeWeatherPredict(true)
        })
      }
    }
  }

  return (
    <div className={`py-8 sm:pt-16 h-full 
    ${contentPredict 
      ? contentPredict.prediction_value === "0" 
        ? "bg-sunny-background" 
        : "bg-rainy-background"
      : "bg-about-background"
      }`
    }
    >
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
            onClick={()=>{mqttSub(baca_data_temp_hum, 'now');mqttSub(baca_data_light, 'now')}}
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

        {subscribeWeatherNow && (
          <article className="max-w-xl items-start justify-between">
            <div className="group relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-white">
                <span className="absolute inset-0" />Today's Weather
              </h3>
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-white">
                  {date}
                </time>
              </div>
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-white">
                  {time}
                </time>
              </div>
              <h1 className="mt-5 text-9xl text-white">{temperature ? parseInt(temperature) : ""}ºC</h1>
            </div>
            <div className='bg-white rounded-lg p-4 w-72 mt-10'>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Humidity</h6>
                <p>{humidity ? parseInt(humidity) : ""} %</p>
              </div>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Light</h6>
                <p>{light}</p>
              </div>
            </div>
          </article>
        )}
        {subscribeWeatherPredict && 
          <article className="max-w-xl items-start justify-between">
            <div className="group relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-white">
                  <span className="absolute inset-0" /> Weather Forecast in 6 Hours
              </h3>
            </div>
            <div className='bg-white rounded-lg p-4 w-72 mt-5'>
              <div className='flex justify-between'>
                <h6 className='text-gray-400 font-bold'>Status</h6>
                <p>{contentPredict 
                  ? contentPredict.prediction_value === "0" 
                    ? "Will Not Rain" 
                    : "Will Rain"
                  : ""
                }</p>
              </div>
            </div>
          </article>
        }
        
        {connectStatus === "Connected" && showElement && (
          <div className="flex p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 w-60 absolute bottom-0 right-28" role="alert">
            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg><span className="font-medium">Connection successful</span>
          </div>
        )}
        {connectStatus === "Reconnecting" && showElement && (
          <div className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 float-right w-60 absolute bottom-0 right-28" role="alert">
            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            <span className="font-medium">Reconnecting</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home