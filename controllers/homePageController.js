let getHomePage = async (req, res) => {
    return res.render("homepage.ejs",{
        user: req.user
    });
};

module.exports = {
    getHomePage: getHomePage,
};