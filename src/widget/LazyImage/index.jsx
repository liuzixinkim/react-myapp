import React, { PureComponent } from "react";
import LazyLoad from "vanilla-lazyload";


if (!document.lazyLoadInstance) {
    document.lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy"
    });
}

class LazyImage extends PureComponent {

    componentDidMount() {
        document.lazyLoadInstance.update();
    }


    componentDidUpdate() {
        document.lazyLoadInstance.update();
    }

    render() {
        const { alt, src, srcset, sizes, width, height, classes, onClick } = this.props;
        return (
            <img
                alt={alt ? alt : ''}
                className={`lazy ${classes ? classes : ''}`}
                src={src}
                data-srcset={srcset}
                data-sizes={sizes ? sizes : null}
                width={width ? width : null}
                height={height ? height : null}
                onClick={onClick ? onClick : null}
            />

        );
    }
}

export default LazyImage;
