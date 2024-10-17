// ** React
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

// ** Mui
import { styled, useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Box, Button, Rating } from '@mui/material'
import { TProduct } from 'src/types/product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

/// ** Components
import Icon from 'src/components/Icon'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

// ** Others
import { ROUTE_CONFIG } from 'src/configs/route'
import { convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Storage
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { likeProductAsync, unLikeProductAsync } from 'src/stores/product/actions'

interface TCardProduct {
  item: TProduct
}

const StyleCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  boxShadow: theme.shadows[4],
  '.MuiCardMedia-root.MuiCardMedia-media': {
    objectFit: 'contain'
  }
}))

const CardProduct = (props: TCardProduct) => {
  // ** Props
  const { item } = props

  // ** Hooks
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // ** handle
  const handleNavigateDetails = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  const handleUpdateProductToCart = (item: TProduct) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const discountItem = isExpiry(item.discountStartDate, item.discountEndDate) ? item.discount : 0

    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: 1,
      image: item.image,
      price: item.price,
      discount: discountItem,
      product: item._id,
      slug: item.slug
    })

    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const handleBuyProductToCart = (item: TProduct) => {
    handleUpdateProductToCart(item)
    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,
        query: {
          selected: item._id
        }
      },
      ROUTE_CONFIG.MY_CART
    )
  }

  const handleToggleLikeProduct = (id: string, isLiked: boolean) => {
    if (user?._id) {
      if (isLiked) {
        dispatch(unLikeProductAsync({ productId: id }))
      } else {
        dispatch(likeProductAsync({ productId: id }))
      }
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const memoIsExpiry = useMemo(() => {
    return isExpiry(item.discountStartDate, item.discountEndDate)
  }, [item])

  return (
    <StyleCard sx={{ width: '100%' }}>
      <CardMedia component='img' height='194' image={item.image} alt='image' />
      <CardContent sx={{ padding: '8px 12px' }}>
        <Typography
          onClick={() => handleNavigateDetails(item.slug)}
          variant='h5'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkitLineClamp': '2',
            '-webkitBoxOrient': 'vertical',
            minHeight: '48px',
            mb: 2
          }}
        >
          {item.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {item.discount > 0 && memoIsExpiry && (
            <Typography
              variant='h6'
              sx={{
                color: theme.palette.error.main,
                fontWeight: 'bold',
                textDecoration: 'line-through',
                fontSize: '14px'
              }}
            >
              {formatNumberToLocal(item.price)} VND
            </Typography>
          )}
          <Typography
            variant='h4'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            {item.discount > 0 && memoIsExpiry ? (
              <>{formatNumberToLocal((item.price * (100 - item.discount)) / 100)}</>
            ) : (
              <>{formatNumberToLocal(item.price)}</>
            )}{' '}
            VND
          </Typography>
          {item.discount > 0 && memoIsExpiry && (
            <Box
              sx={{
                backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                width: '36px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px'
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: theme.palette.error.main,
                  fontSize: '10px',
                  whiteSpace: 'nowrap'
                }}
              >
                - {item.discount} %
              </Typography>
            </Box>
          )}
        </Box>
        {item.countInStock > 0 ? (
          <Typography variant='body2' color='text.secondary' sx={{ my: 1 }}>
            <>{t('Count_in_stock')}</> <b>{item.countInStock}</b> <>{t('Product')}</>
          </Typography>
        ) : (
          <Box
            sx={{
              backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
              width: '60px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px',
              my: 1
            }}
          >
            <Typography
              variant='h6'
              sx={{
                color: theme.palette.error.main,
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              Hết hàng
            </Typography>
          </Box>
        )}

        {item.sold ? (
          <Typography variant='body2' color='text.secondary'>
            <>{t('Sold_product')}</> <b>{item.sold}</b> <>{t('Product')}</>
          </Typography>
        ) : (
          <Typography variant='body2' color='text.secondary'>
            {t('No_sell_product')}
          </Typography>
        )}
        {(item?.location?.name || item.views) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: 2 }}>
            {item?.location?.name && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Icon icon='carbon:location' />

                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {item?.location?.name}
                </Typography>
              </Box>
            )}
            {item?.views && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Icon icon='lets-icons:view-light' />

                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {item?.views}
                </Typography>
              </Box>
            )}
            {!!item?.uniqueViews?.length && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Icon icon='mdi:account-view-outline' />
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {item?.uniqueViews?.length}
                </Typography>
              </Box>
            )}
            {!!item?.likedBy?.length && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Icon icon='icon-park-outline:like' />
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {item?.likedBy?.length}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!!item.averageRating ? (
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  name='read-only'
                  sx={{ fontSize: '16px' }}
                  defaultValue={item?.averageRating}
                  precision={0.5}
                  readOnly
                />
              </Typography>
            ) : (
              <Rating name='read-only' sx={{ fontSize: '16px' }} defaultValue={0} precision={0.5} readOnly />
            )}
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              {!!item.totalReviews ? <b>{item.totalReviews}</b> : <span>{t('not_review')}</span>}
            </Typography>
          </Box>
          <IconButton
            onClick={() => handleToggleLikeProduct(item._id, Boolean(user && item?.likedBy?.includes(user._id)))}
          >
            {user && item?.likedBy?.includes(user._id) ? (
              <Icon icon='mdi:heart' style={{ color: theme.palette.primary.main }} />
            ) : (
              <Icon icon='tabler:heart' style={{ color: theme.palette.primary.main }} />
            )}
          </IconButton>
        </Box>
      </CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px 10px', gap: 2 }}>
        <Button
          variant='outlined'
          fullWidth
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontWeight: 'bold'
          }}
          disabled={item.countInStock < 1}
          onClick={() => handleUpdateProductToCart(item)}
        >
          <Icon icon='bx:cart' fontSize={24} style={{ position: 'relative', top: '-2px' }} />
          {t('Add_to_cart')}
        </Button>
        <Button
          fullWidth
          variant='contained'
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontWeight: 'bold'
          }}
          disabled={item.countInStock < 1}
          onClick={() => handleBuyProductToCart(item)}
        >
          <Icon icon='icon-park-outline:buy' fontSize={20} style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </StyleCard>
  )
}

export default CardProduct
