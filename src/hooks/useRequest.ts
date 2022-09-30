import { useCallback, useState } from 'react'
import { IResponse } from '../../types'

const useRequest = <DataType>(asnycFunction: () => Promise<DataType>, resetData?: boolean) => {
  const [data, setData] = useState<DataType>(undefined)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(() => {
    resetData && setData(null)
    setLoading(true)
    return asnycFunction()
      .then(res => {
        setData(res)
        return res
      })
      .catch(e => Promise.reject(e))
      .finally(() => setLoading(false))
  }, [asnycFunction])

  return { execute, data, loading }
}

export default useRequest
