import { useAppSelector } from '../../hooks/useAppSelector'

const Avatar = () => {

    const userInfo = useAppSelector(state => state.user.userInfo);

    if (!userInfo) {
        return null
    }

    return (
        <div style={{ width: 38, height: 38 }}>
            {userInfo.picture ?
                <img
                    className='bg-secondary rounded-circle cursor-pointer'
                    src={userInfo.picture}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: 'cover' }}
                />
                :
                userInfo.mail[0].toUpperCase()
            }
        </div>
    )
}

export default Avatar
