import { first } from 'lodash'
import { useState, useEffect } from 'react'

import styles from './styles'
const assetDomain = process.env.config?.baseEndpoint ?? '',
    assetPrefix = process.env.config?.assetPrefix ?? ''

const data = [
    {
        id: 12,
        title: 'Understanding Your Needs',
        description:
            'Select the best plan for you and your family from a wide range of options.',
        video: `${assetPrefix}/images/app/flow-1-Understanding your need.mov`,
    },
    {
        id: 222,
        title: 'Fast Onboarding',
        description: 'Simple application with a full online process.',
        video: `${assetPrefix}/images/app/flow-2-Easy onboarding.mov`,
    },
    {
        id: 33,
        title: 'Easy Payment',
        description:
            'Payment can be done within minutes to activate a new policy.',
        video: `${assetPrefix}/images/app/flow-3-Easy payment.mov`,
    },
]
export default function AppSection({ isDesktop }) {
    const [heroHeight, setHeroHeight] = useState(0)
    const [isWebpSupport, setIsWebpSupport] = useState(true)
    let headerHeight = 80

    useEffect(() => {
        if (window) {
            setHeroHeight(window.innerHeight + headerHeight)
            if (window.Modernizr.webp) {
                setIsWebpSupport(true)
            } else {
                setIsWebpSupport(false)
            }
        }

        let observerOptions = {
            rootMargin: '0px',
            threshold: [0.3],
        }

        let observer = new IntersectionObserver(
            observerCallback,
            observerOptions
        )

        let target = document.querySelector('.animation-wrapper')
        observer.observe(target)

        if (data) {
            data.map((dt, index) => {
                const videoEl = document.getElementById(`video-${index}`)
                if (videoEl) {
                    videoEl.ontimeupdate = videoTimeUpdate
                }
            })
        }

        return () => {
            document.removeEventListener('click', () => {})
        }
    }, [])

    const videoTimeUpdate = (event) => {
        const currentTime = event.currentTarget?.currentTime ?? 1,
            duration = event.currentTarget?.duration ?? 1,
            id = event.currentTarget?.dataset?.id ?? '',
            timePlayed = (currentTime / duration) * 100

        const bar = document.querySelector(`#bar-${id}>span`)
        if (bar) bar.style.width = `${timePlayed}%`

        if (timePlayed == 100) {
            const idInc = parseInt(id) + 1
            if (idInc < data.length) {
                playVideo(idInc)
            }
        }
    }

    const playVideo = (id, resetOther = false) => {
        //resetOther = true -> only when user select specific step
        if (data) {
            data.map((dt, index) => {
                const videoEl = document.getElementById(`video-${index}`)
                if (videoEl) {
                    videoEl.style.opacity = index == id ? '1' : '0'
                }

                if (index == id) {
                    const containerEl = document.getElementById(
                        `info-flow-${index}`
                    )
                    if (containerEl) {
                        containerEl.classList.add('is-active')
                    }
                    if (videoEl) videoEl.play()
                } else {
                    if (resetOther) {
                        if (videoEl) {
                            videoEl.pause()
                            videoEl.currentTime = 0
                        }

                        const barEl = document.querySelector(
                            `#bar-${index}>span`
                        )
                        if (barEl) {
                            console.log('masuk')
                            barEl.style.width = '0'
                        }
                        const containerEl = document.getElementById(
                            `info-flow-${index}`
                        )
                        if (containerEl) {
                            containerEl.classList.remove('is-active')
                        }
                    }
                }
            })
        }
    }

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                playVideo(0)
            }
        })
    }

    let deviceImage = `${assetPrefix}/images/app/device-iphone.png`
    return (
        <>
            <div
                className={`wrapper ${isDesktop ? '' : 'is-mobile'}`}
                style={{
                    height: `${heroHeight}px`,
                }}
            >
                <h2>
                    {data?.title ?? 'Get Protected by Vida in 3 Simple Steps'}
                </h2>
                <div className="animation-wrapper">
                    <div
                        className="device-wrapper"
                        style={{
                            backgroundImage: `url(${deviceImage})`,
                        }}
                    >
                        {data &&
                            data.map((dt, index) => (
                                <video
                                    key={dt.id}
                                    muted
                                    id={`video-${index}`}
                                    data-id={index}
                                >
                                    <source src={dt.video} type="video/mp4" />
                                    Your browser does not support HTML5 video.
                                </video>
                            ))}
                    </div>

                    <div className={'steps-info'}>
                        {data &&
                            data.map((dt, index) => (
                                <div
                                    key={dt.id}
                                    id={`info-flow-${index}`}
                                    className="steps-wrapper"
                                    onClick={() => {
                                        playVideo(index, true)
                                    }}
                                >
                                    <div
                                        id={`bar-${index}`}
                                        className="progress-bar"
                                    >
                                        <span></span>
                                    </div>
                                    <div className="steps-title">
                                        {dt.title}
                                    </div>
                                    <div className="steps-desc">
                                        {dt.description}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <style jsx>{styles}</style>
        </>
    )
}
