// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** React
import { useEffect, useState } from 'react'

// ** Mui
import { Box, Tab, Tabs, TabsProps, styled, useTheme } from '@mui/material'

// ** Components
import NoData from 'src/components/no-data'
import CardOrder from 'src/views/pages/my-order/components/CardOrder'
import CustomPagination from 'src/components/custom-pagination'
import Spinner from 'src/components/spinner'
import InputSearch from 'src/components/input-search'

// ** Translate
import { useTranslation } from 'react-i18next'

// ** Redux
import { getAllOrderProductsByMeAsync } from 'src/stores/order-product/actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/order-product'

// ** Other
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import toast from 'react-hot-toast'

// ** Types
import { TItemOrderProductMe } from 'src/types/order-product'

type TProps = {}

const VALUE_OPTION_STATUS = {
  WAIT_PAYMENT: 0,
  WAIT_DELIVERY: 1,
  DONE: 2,
  CANCEL: 3,
  ALL: 4
}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: 'none'
  }
}))

const MyOrderPage: NextPage<TProps> = () => {
  // State
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [page, setPage] = useState(1)
  const [statusSelected, setStatusSelected] = useState(VALUE_OPTION_STATUS.ALL)
  const [searchBy, setSearchBy] = useState('')

  // ** Hooks
  const { t } = useTranslation()

  const OPTIONS_STATUS = [
    {
      label: t('All'),
      value: VALUE_OPTION_STATUS.ALL
    },
    {
      label: t('Wait_payment'),
      value: VALUE_OPTION_STATUS.WAIT_PAYMENT
    },
    {
      label: t('Wait_delivery'),
      value: VALUE_OPTION_STATUS.WAIT_DELIVERY
    },
    {
      label: t('Done'),
      value: VALUE_OPTION_STATUS.DONE
    },
    {
      label: t('Cancel_order'),
      value: VALUE_OPTION_STATUS.CANCEL
    }
  ]
  const router = useRouter()

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { ordersOfMe, isLoading, isErrorCancelMe, isSuccessCancelMe, messageErrorCancelMe } = useSelector(
    (state: RootState) => state.orderProduct
  )

  // ** fetch API
  const handleGetListOrdersOfMe = () => {
    const query = {
      params: {
        limit: pageSize,
        page: page,
        status: statusSelected === VALUE_OPTION_STATUS.ALL ? '' : statusSelected,
        search: searchBy
      }
    }
    dispatch(getAllOrderProductsByMeAsync(query))
  }

  // ** Handle
  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setStatusSelected(+newValue)
  }

  useEffect(() => {
    handleGetListOrdersOfMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, statusSelected, searchBy])

  useEffect(() => {
    if (isSuccessCancelMe) {
      toast.success(t('Cancel_order_success'))
      handleGetListOrdersOfMe()
      dispatch(resetInitialState())
    } else if (isErrorCancelMe && messageErrorCancelMe) {
      toast.error(t('Cancel_order_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessCancelMe, isErrorCancelMe, messageErrorCancelMe])

  return (
    <>
      {isLoading && <Spinner />}
      <StyledTabs value={statusSelected} onChange={handleChange} aria-label='wrapped label tabs example'>
        {OPTIONS_STATUS.map(opt => {
          return <Tab key={opt.value} value={opt.value} label={opt.label} />
        })}
      </StyledTabs>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <Box sx={{ width: '300px' }}>
          <InputSearch
            placeholder={t('Search_name_product')}
            value={searchBy}
            onChange={(value: string) => setSearchBy(value)}
          />
        </Box>
      </Box>
      <Box>
        {ordersOfMe?.data?.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px' }}>
            {ordersOfMe?.data.map((item: TItemOrderProductMe, index: number) => {
              return <CardOrder dataOrder={item} key={item._id} />
            })}
          </Box>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ padding: '20px', width: '200px' }}>
              <NoData widthImage='80px' heightImage='80px' textNodata={t('No_product')} />
            </Box>
          </Box>
        )}
      </Box>
      <Box mt={4}>
        <CustomPagination
          onChangePagination={handleOnchangePagination}
          pageSizeOptions={PAGE_SIZE_OPTION}
          pageSize={pageSize}
          page={page}
          rowLength={ordersOfMe.total}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default MyOrderPage
