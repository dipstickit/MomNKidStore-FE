import { useEffect } from 'react';

const useScrollToTop = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // phương thức của window, (0,0 ) cuộn lên trên cùng của trang
    }, []);
};

export default useScrollToTop;
