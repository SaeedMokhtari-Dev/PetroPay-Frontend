import React from 'react';

interface NotFoundPageProps {
}

const NotFoundPage: React.FC<NotFoundPageProps> = (props) =>
{
    return (
        <div style={{margin: '20px'}}>404: Not Found</div>
    )
};

export default NotFoundPage;