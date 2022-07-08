class APIFeatures {
    constructor(query, queryStr) {
        // query - documents; queryStr - from URL
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryObj = { ...this.queryStr };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            match => `$${match}`
        ); // to make filter objects contain "$" before the operators

        this.query = this.query.find(JSON.parse(queryStr));

        return this; // to make it possible to chain all the methods then
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' '); // to replace commas in URLs with spaces
            this.query = this.query.sort(sortBy);
        } else {
            // default sorting
            this.query = this.query.sort('-createdAt _id');
            /* If using the $skip stage with any of sort be sure to include at least one field in your sort that contains unique values, before passing results to the $skip stage.*/
        }

        return this;
    }

    limitFields() {
        // Limiting must be either inclusive or exclusive
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            if (fields[0] === '-')
                this.query = this.query.select(`${fields} -__v`);
            else this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
