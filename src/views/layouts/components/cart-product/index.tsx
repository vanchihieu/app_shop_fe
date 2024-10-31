// ** React
import React, { useEffect, useMemo } from 'react'

// ** Next
import { useRouter } from 'next/router'

// ** Mui Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Badge, Button, Typography, styled, useTheme } from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Translate
import { useTranslation } from 'react-i18next'

// ** config
import { ROUTE_CONFIG } from 'src/configs/route'

// ** Storage
import { getLocalProductCart } from 'src/helpers/storage'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

// ** Types
import { TItemOrderProduct } from 'src/types/order-product'

// ** Utils
import { formatNumberToLocal } from 'src/utils'
import NoData from 'src/components/no-data'

type TProps = {}

const StyleMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({}))

const CartProduct = (props: TProps) => {
  // ** Translation
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  // ** Hooks
  const { user } = useAuth()
  const theme = useTheme()
  const router = useRouter()

  // ** Redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()

  const open = Boolean(anchorEl)

  // && Handle
  const handleNavigateDetailsProduct = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  const handleNavigateMyCart = () => {
    router.push(`${ROUTE_CONFIG.MY_CART}`)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: parseData[user?._id] || []
        })
      )
    }
  }, [user])

  const totalItemsCart = useMemo(() => {
    const total = orderItems?.reduce((result, current: TItemOrderProduct) => {
      return result + current.amount
    }, 0)

    return total
  }, [orderItems])

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('My_cart')}>
          <IconButton onClick={handleClick} color='inherit'>
            {!!orderItems.length ? (
              <Badge color='primary' badgeContent={totalItemsCart}>
                <Icon icon='flowbite:cart-outline' />
              </Badge>
            ) : (
              <Icon icon='flowbite:cart-outline' />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {orderItems?.length > 0 ? (
          <>
            <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
              {orderItems?.map((item: TItemOrderProduct) => {
                return (
                  <StyleMenuItem key={item.product} onClick={() => handleNavigateDetailsProduct(item.slug)}>
                    <Avatar src={item.image} sx={{ height: '60px !important', width: '60px !important' }} />
                    <Box style={{flex: 1}}>
                      <Typography sx={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.discount > 0 && (
                            <Typography
                              variant='h6'
                              sx={{
                                color: theme.palette.error.main,
                                fontWeight: 'bold',
                                textDecoration: 'line-through',
                                fontSize: '10px'
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
                              fontSize: '12px'
                            }}
                          >
                            {item.discount > 0 ? (
                              <>{formatNumberToLocal((item.price * (100 - item.discount)) / 100)}</>
                            ) : (
                              <>{formatNumberToLocal(item.price)}</>
                            )}{' '}
                            VND
                          </Typography>
                        </Box>
                        <Typography>x <b>{item.amount}</b></Typography>
                      </Box>
                    </Box>
                  </StyleMenuItem>
                )
              })}
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, mr: 2 }} onClick={handleNavigateMyCart}>
                {t('View_cart')}
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ padding: '20px', width: '200px' }}>
            <NoData widthImage='60px' heightImage='60px' textNodata={t('No_product')} />
          </Box>
        )}
      </Menu>
    </React.Fragment>
  )
}

export default CartProduct