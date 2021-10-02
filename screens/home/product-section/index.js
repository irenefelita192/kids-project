import { useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './styles'
const assetDomain = process.env.config?.baseEndpoint ?? '',
    assetPrefix = process.env.config?.assetPrefix ?? ''

export default function ProductSection({ data }) {
    const [productActive, setProductActive] = useState(1)

    useEffect(() => {
        return () => {}
    }, [])

    const handleNavigate = (direction) => {
        if (direction == 'prev' && productActive > 1) {
            setProductActive(productActive - 1)
        }

        if (direction == 'next' && productActive < data.length) {
            setProductActive(productActive + 1)
        }
    }

    return (
        <div className="third-wrapper">
            {data &&
                data.map((prd) => {
                    return (
                        <CSSTransition
                            in={productActive == prd.id}
                            timeout={100}
                            classNames="product-transition"
                            key={prd.id}
                        >
                            <div
                                key={prd.id}
                                className={`product-wrapper ${
                                    productActive == prd.id ? 'is-active' : ''
                                }`}
                            >
                                <div
                                    style={{
                                        backgroundColor: prd.backgroundColor,
                                    }}
                                >
                                    <div>
                                        <h2>{prd.title}</h2>
                                    </div>
                                    <div>{prd.description}</div>
                                    <div className="btn-navigation">
                                        <div
                                            className={`btn-prev ${
                                                productActive == 1
                                                    ? 'disabled'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleNavigate('prev')
                                            }
                                        >
                                            <i
                                                style={{
                                                    backgroundImage: `url(${assetPrefix}/images/home/btn-prev.svg)`,
                                                }}
                                            ></i>
                                        </div>
                                        <div
                                            className={`btn-next ${
                                                productActive == data.length
                                                    ? 'disabled'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleNavigate('next')
                                            }
                                        >
                                            <i
                                                style={{
                                                    backgroundImage: `url(${assetPrefix}/images/home/btn-next.svg)`,
                                                }}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img
                                        src={`${assetDomain}${
                                            prd?.image?.url ?? ''
                                        }`}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </CSSTransition>
                    )
                })}
            <style jsx>{styles}</style>
        </div>
    )
}