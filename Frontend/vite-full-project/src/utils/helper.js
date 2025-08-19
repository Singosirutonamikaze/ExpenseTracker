import moment from "moment";

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const getInitials = (fullName) => {

    let initials = '';
    if (!fullName) {
        return initials;
    }
    const names = fullName.trim().split(' ').filter(n => n.length > 0);

    for (let i = 0; i < names.length; i++) {
        if (names[i] && names[i][0]) {
            initials += names[i][0].toUpperCase();
        }
    }
    return initials;
}

export const addThousandSeparator = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
        return '0';
    }

    const [integerPart, fractionalPart] = num.toString().split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return fractionalPart
        ? `${formattedIntegerPart}.${fractionalPart}`
        : formattedIntegerPart;
}

export const prepareExpenseBarChartData = (data = []) => {
   const safeData = Array.isArray(data) ? data : [];
  
   const chartData = safeData.map((item) => ({
       category: item?.category || 'Non catégorisé',
       amount: Number(item?.amount) || 0
   }));

   return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format('MMMM YYYY'),
        amount: Number(item?.amount) || 0,
        source: item?.source 
    }));

    return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        date: moment(item?.date).format('YYYY-MM-DD'),
        amount: Number(item?.amount) || 0,
        category: item?.category
    }));

    return chartData;
};